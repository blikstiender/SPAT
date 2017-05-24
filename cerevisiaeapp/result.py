from cerevisiaeapp import app
from threading     import Thread
from subprocess    import Popen, PIPE, STDOUT

import csv
import os
import shutil
import time
import utilities as util




class result: 
    input_data        = None # object to contain the data sent from the frontend
    dna_seq           = None # object to contain the dna seqs from the data after the data is processed
    protein_seq_file_path = None 
    output_format     = None # TODO: get rid of this
    id                = None # the result id 
    filename          = None # the filename of the result 
    temp_dir_path     = None # directory of the temportary files for the result 
    ready_for_xstream = False # is the result ready for initial xstream processing 
    job_complete      = False # is the result completely ready?
    
    def __init__(self, id, filename="", input_data="", output_format="csv"): 
        self.input_data = input_data
        self.id = id
        self.output_format = output_format
        if filename == "":
            self.filename = id + "-result." + output_format # e.g. mx6m08s-result.fasta
        else: 
            self.filename = filename
        
        # analyze the file on a different thread, to allow active-job querying 
        thread = Thread(target = self.analyze)
        thread.start()      

    def analyze(self): 
        self._prepare_seq_for_analysis_()
        result = self._run_xstream_analysis_()
        self.write_result(result)
        self.job_complete = True

    def write_result(self, result_obj):
        assert self.filename != None
        assert isinstance(result_obj, list) and len(result_obj) > 0
        
        filename = self.id + "-result"
        fieldnames = [key for key in result_obj[0]]
        if True: # self.output_format="csv": 
            filename = filename + ".xls"
            with open(app.config["results_dir"] + filename, 'w') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for row in result_obj: 
                    writer.writerow(row)
        self.filename = filename

    # translates the data into a protein sequence, and saves it in an appropriate 
    # temporary folder for further xstream analysis 
    def _prepare_seq_for_analysis_(self):             
        assert self.input_data != None and self.id != None
        self.temp_dir_path = os.path.join(app.config["temp_dir"], self.id)
        self.protein_seq_file_path = self.id + "_protein_temp"
        os.makedirs(self.temp_dir_path)
        shutil.copyfile(app.config["xstream_exec"], os.path.join(self.temp_dir_path,"xstream.jar"))
        self.dna_seq = util.load_fasta_file(util.string_to_file(self.input_data["data"]["raw"]))
        self.input_data["data"]    = None # data back to none, since we now have self.dna_seq
        util.save_fasta(os.path.join(self. temp_dir_path, self.protein_seq_file_path), util.trans_fasta(self.dna_seq))
        self.ready_for_xstream = True


    # runs the xstream analysis, retreives the results into a python object, and 
    # erases the temporary files
    def _run_xstream_analysis_(self): 
        assert self.ready_for_xstream 
        
        #TODO: add xstream options here
        xstream_cmd_arr = ["java", "-jar", "xstream.jar"]
        for input_opt in self.input_data["input_opt"]: 
            xstream_cmd_arr.append(input_opt + str(self.input_data["input_opt"][input_opt]))
        xstream_cmd_arr.extend(["-z", self.protein_seq_file_path])
        xstream_cmd = " ".join(xstream_cmd_arr)
        gotopath_cmd = " ".join(["cd", self.temp_dir_path])
        final = Popen("{}; {}".format(gotopath_cmd, xstream_cmd), shell=True, close_fds=True,
                                                                stdin=PIPE, stdout=PIPE, stderr=STDOUT)
        stdout, nothing = final.communicate()
        output_file = [file for file in os.listdir(self.temp_dir_path) if ".xls" in file][0]
        xstream_results = util.load_csv(os.path.join(self.temp_dir_path, output_file), delimiter="\t")
        # shutil.rmtree(self.temp_dir_path)
        seq_dict = {} # dictionary to hold all the dna sequences for faster lookup
        for seq in self.dna_seq: 
            seq_dict[seq.id] = seq

        results = []
        for xresult in xstream_results: 
            xresult = util.format_xstream_result(xresult)
            xresult_seq = seq_dict[xresult["id"]].seq[xresult["repeat region start"]:xresult["repeat region end"]]
            seq_stats = util.seq_stats(xresult_seq, self.input_data["output_opt"])
            
            results_combined = seq_stats.copy()
            results_combined.update(xresult)
            results.append(results_combined)

        return results















