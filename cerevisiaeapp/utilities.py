# utlities.py
# module to contain some common used functionality
# Yotam Bentov 2015

import csv 
from Bio import SeqIO
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio.Alphabet import IUPAC
from cStringIO import StringIO




def get_seq_count(seq): 
    return {
        "g": seq.count('G') + seq.count('g'),
        "c": seq.count('C') + seq.count('c'),
        "a": seq.count('A') + seq.count('a'),
        "t": seq.count('T') + seq.count('t'),
        "length": len(seq)
    }

# creates the dictionary with all the sequence options 
# NOTE: optiopns corrospond to optionsconfig.js file 
def _make_seq_stat_dict_(): 
    def g(stats): 
        return stats["g"]
    def c(stats): 
        return stats["c"]
    def t(stats): 
        return stats["t"]
    def a(stats): 
        return stats["a"]
    def g_plus_c(stats): 
        return stats["g"] + stats["c"] 
    def g_minus_c(stats): 
        return stats["g"] - stats["c"] 
    def a_plus_t(stats): 
        return stats["a"] + stats["t"] 
    def a_minus_t(stats): 
        return stats["a"] - stats["t"]
    def g_plus_c_over_length(stats): 
        return ( stats["g"] + stats["c"] ) / stats["length"]
    def g_minus_c_over_length(stats): 
        return ( stats["g"] - stats["c"] ) / stats["length"]
    def a_plus_t_over_length(stats): 
        return ( stats["a"] + stats["t"] ) / stats["length"]
    def a_minus_t_over_length(stats): 
        return ( stats["a"] - stats["t"] ) / stats["length"]

    return {
        "G": g,
        "C": c,
        "A": a,
        "T": t,
        "G+C": g_plus_c, 
        "G-C": g_minus_c, 
        "A+T": a_plus_t, 
        "A-T": a_minus_t,
        "G+C/L": g_plus_c_over_length, 
        "G-C/L": g_minus_c_over_length, 
        "A+T/L": a_plus_t_over_length, 
        "A-T/L": a_minus_t_over_length,
    }




# takes in a list of stats and a sequence and returns the dictionary for those stats 
seq_stats_functions = _make_seq_stat_dict_()
def seq_stats(seq, stats):
    return_dict = {}
    seq_count = get_seq_count(seq)
    for key in stats: 
        if key in seq_stats_functions and stats[key] == True: 
            return_dict[key] = seq_stats_functions[key](seq_count)
    return return_dict

# takes an xstream results and changes the field names to something a bit less menacing
def format_xstream_result(xresult): 
    xresult["id"] = xresult.pop("identifier")
    additional_stats = {
        "repeat region start": (int(xresult["start"]) -1 ) * 3, 
        "repeat region end":   (int(xresult["end"])) * 3, 
        "protein start": xresult.pop("start"),
        "protein end":   xresult.pop("end")
    }

    for key in additional_stats: 
        xresult[key] = additional_stats[key]
    return xresult

# classic load csv
def load_csv(file_path, delimiter=','):
    return list(csv.DictReader(open(file_path, 'rb'),  delimiter=delimiter))

# save csv to file path
def save_csv(file_path, data, fieldnames=[]):
    with open(file_path, 'w') as csvfile:
        if len(fieldnames) == 0:
            fieldnames = data[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow(row)

# load fasta file to python dictionary
def load_fasta_file_path(file_path):
    with open(file_path, 'rb') as handle: 
        return list(SeqIO.parse(handle, "fasta"))

def load_fasta_file(filehandle):
    return list(SeqIO.parse(filehandle, "fasta"))

def load_fasta_dict(file_path): 
    seqs = load_fasta(file_path)
    ret_dict = {}
    for seq in seqs: 
        ret_dict[seq.id] = seq
    return ret_dict

# save fasta file 
def save_fasta(file_path, data):
    with open(file_path, 'w') as handle: 
        SeqIO.write(data, handle, 'fasta')


# translate fasta
def trans_fasta(data_arr):
    ret_arr = []
    for dna_seq in data_arr:
        protein_seq = dna_seq.seq.translate()
        record = SeqRecord(protein_seq, id=dna_seq.id, name=dna_seq.name, description="") # description as well?
        ret_arr.append(record)
    return ret_arr


def string_to_file(string): 
    return StringIO(string)