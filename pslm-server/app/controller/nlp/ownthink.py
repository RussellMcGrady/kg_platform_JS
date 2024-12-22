#!/usr/bin/python
# -*- coding: UTF-8 -*-

import jiagu
import sys
import io
# 避免print中文结果为乱码
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')

# jiagu.load_model('test/extra_data/model/cnc.model') # 使用国家语委分词标准

if sys.argv[1] == 'kgExtraction':
    knowledge = jiagu.knowledge(sys.argv[2])
    print(knowledge)
elif sys.argv[1] == 'keywordExtraction':
    keywords = jiagu.keywords(sys.argv[2], int(sys.argv[3])) # 关键词
    print(keywords)
elif sys.argv[1] == 'summarizeExtraction':
    f = open('app/static/summarize.txt', 'w+', encoding='utf-8')
    f.write(sys.argv[2])
    f.close()
    
    fin = open('app/static/summarize.txt', 'r', encoding='utf-8')
    text = fin.read()
    fin.close()
    summarize = jiagu.summarize(text, int(sys.argv[3])) # 关键词
    print(summarize)
elif sys.argv[1] == 'sentimentExtraction':
    sentiment = jiagu.sentiment(sys.argv[2])
    print(sentiment)
elif sys.argv[1] == 'textCluster':
    cluster = jiagu.text_cluster(sys.argv[2])  
    print(cluster)
elif sys.argv[1] == 'cutExtraction':
    words = jiagu.cut(sys.argv[2]) # 深度学习分词
    print(words)
elif sys.argv[1] == 'nerExtraction':
    words = jiagu.cut(sys.argv[2]) # 深度学习分词
    ner = jiagu.ner(words) # 命名实体识别
    print(ner)
elif sys.argv[1] == 'posExtraction':
    words = jiagu.cut(sys.argv[2]) # 深度学习分词
    pos = jiagu.pos(words) # 词性标注
    print(pos)

# import jiagu 文档说明

# text = '汉服和服装、知识图谱机器人'

# words = jiagu.cut(text) # 深度学习分词
# print(words)

# words = jiagu.seg(text) # 字典分词
# print(words)

# # jiagu.load_userdict('dict/user.dict') # 加载自定义字典，支持字典路径、字典列表形式。
# jiagu.load_userdict(['知识图谱'])

# words = jiagu.seg(text) # 自定义分词，字典分词模式有效
# print(words)

# 独立标准模型路径
# msr：test/extra_data/model/msr.model
# pku：test/extra_data/model/pku.model
# cnc：test/extra_data/model/cnc.model
# import json

# n　　　普通名词
# nt　 　时间名词
# nd　 　方位名词
# nl　 　处所名词
# nh　 　人名
# nhf　　姓
# nhs　　名
# ns　 　地名
# nn 　　族名
# ni 　　机构名
# nz 　　其他专名
# v　　 动词
# vd　　趋向动词
# vl　　联系动词
# vu　　能愿动词
# a　 　形容词
# f　 　区别词
# m　 　数词　　
# q　 　量词
# d　 　副词
# r　 　代词
# p　　 介词
# c　 　连词
# u　　 助词
# e　 　叹词
# o　 　拟声词
# i　 　习用语
# j　　 缩略语
# h　　 前接成分
# k　　 后接成分
# g　 　语素字
# x　 　非语素字
# w　 　标点符号
# ws　　非汉字字符串
# wu　　其他未知的符号

# B-PER、I-PER   人名
# B-LOC、I-LOC   地名
# B-ORG、I-ORG   机构名