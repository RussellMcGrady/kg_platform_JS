#!/usr/bin/python
# -*- coding: UTF-8 -*-

import sys
from neo4j import GraphDatabase
from sklearn.manifold import TSNE
import numpy as np
import altair as alt
import pandas as pd
# import json

# 加载neo4j driver
driver = GraphDatabase.driver("bolt://localhost", auth=("neo4j", "123456"))

with driver.session(database="neo4j") as session:
    hLabel = sys.argv[1]
    rLabel = sys.argv[2]
    tLabel = sys.argv[3]
    limit = sys.argv[4]
    cypher = 'MATCH (h:`' + hLabel + '`)-[:`' + rLabel + '`]->(t:`' + tLabel + '`) RETURN h.name AS headEntity, h.embeddingNode2Vec AS embedding, t.name AS tailEntity LIMIT ' + limit
    result = session.run(cypher)
    X = pd.DataFrame([dict(record) for record in result])

    X_embedded = TSNE(n_components=2, random_state=6).fit_transform(list(X.embedding))
    df = pd.DataFrame(data = {
        "headEntity": X.headEntity,
        "tailEntity": X.tailEntity,
        "x": [value[0] for value in list(X_embedded)],
        "y": [value[1] for value in list(X_embedded)]
    })
    
    # alt.Chart(df).mark_circle(size=60).encode(
    #     x='x',
    #     y='y',
    #     tooltip=['headEntity', 'tailEntity']
    # ).properties(width=700, height=400).save('app/static/embVis/node2vec.html')

    embChart = alt.Chart(df).mark_circle(size=60).encode(
        x='x',
        y='y',
        color='tailEntity',
        tooltip=['headEntity', 'tailEntity']
    ).properties(width=700, height=400)

    # print(embChart.to_json())

    # 存储
    embChart.save('app/static/embVis/node2vec-color.html')
    embChart.save('app/static/embVis/node2vec-color.json')

    with open('./app/static/emb/embeddings.txt','w+',encoding='utf8')as f:
        f.write(str(list(X.embedding)))
