from collections import Counter

import matplotlib.pyplot as plt
#正常显示中文
from kneed import KneeLocator
from sklearn.metrics import silhouette_score
import os
import sys
import io
plt.rcParams['font.family'] = ['sans-serif']
plt.rcParams['font.sans-serif'] = ['SimHei']
import pandas as pd
import numpy as np
from sklearn import metrics
from sklearn.cluster import KMeans

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')

def getmyk(fawenjianjia):
    for root,dirs,files in os.walk(fawenjianjia):
        for file in files:
            excelPath = os.path.join(root,file)
            getMyKmeans(excelPath)
        break


def myKmeans(data,fileName,wenjianjia):
    # 进行Kmeans聚类
    X = np.array(data)
    # 归一化
    # min_max_scaler = preprocessing.MinMaxScaler()
    # X = min_max_scaler.fit_transform(X)

    # 手肘法
    # SSE = []
    # Scores = []
    # cnli = []
    xticks=  range(2,int(X.shape[0]/2))
    for i in xticks:
        estimatori = KMeans(n_clusters=i,random_state=100)
        estimatori.fit(X)
        estimatori.inertia_


        label = estimatori.labels_
        count = Counter(label)
        count = dict(sorted(count.items(), key=lambda item:item[1]))
        flag = True
        for key in count.keys():
            if(count[key] == 1):
                flag = False
                break
        if(not flag):
            break
        data['label'] = label

        outputData = pd.DataFrame(data.loc[:,'label'])
        outputData.to_csv(wenjianjia+"/cluster k="+str(i)+".csv")
        # SSE.append(estimatori.inertia_)
        # cnlii = metrics.calinski_harabasz_score(X, estimatori.labels_)
        # cnli.append(cnlii)
        # Scores.append(silhouette_score(X,estimatori.labels_,metric='euclidean'))
    # plt.plot(xticks,SSE)
    # plt.title(fileName)
    # # for i in range(Scores.__len__()):
    # #     print(Scores[i])
    #
    # plt.ylabel('SSE')
    # plt.xlabel('k')
    # # plt.show()
    # plt.savefig(wenjianjia+"/族内误方差图.jpg")
    # plt.close()
    # plt.plot(xticks,Scores)
    # plt.title(fileName)
    # plt.ylabel('slihouette')
    # plt.xlabel('k')
    # # plt.show()
    # plt.savefig(wenjianjia+"/轮廓系数图.jpg")
    # plt.close()
    # k_slihou_dict = {}
    # for i in range(0,xticks.__len__()):
    #     k_slihou_dict[xticks[i]] = Scores[i];
    # # # plt.plot(xticks,cnli)
    # # # plt.show()
    # kbest_slihou = max(k_slihou_dict,key=k_slihou_dict.get)
    # # print(kbest_slihou)
    # kn1 = KneeLocator(xticks,SSE, curve='convex', direction='decreasing',online=True)
    # if kn1.all_knees:
    #     kbest = min(kn1.all_knees)
    #     kbest = min(kbest_slihou,kbest)
    #     print(kbest)
    # else:
    #     print(kbest_slihou)
    # kn = KneeLocator(xticks,Scores, curve='concave', direction='increasing',online=True)
    # kbest = kn.knee
    # print(kbest)
    # kexpe = math.floor(math.sqrt(X.shape[0]))
    # print(kbest)

    # # 按拐点取K
    # estimator = KMeans(n_clusters=kbest,random_state=100,max_iter=500)#构造聚类器
    # estimator.fit(X)
    # label_pred = estimator.labels_
    # cnlinsk = metrics.calinski_harabasz_score(X, label_pred)
    # sili = silhouette_score(X,label_pred,metric='euclidean')
    # print(sili)
    # data['label'] = label_pred
    # expath = "..\\..\\resources/pythonToJava"+'/'+fileName+'聚类（拐点）.csv'
    # outputData = pd.DataFrame(data.loc[:,'label'])
    # outputData.to_csv(expath)

    # #按轮廓系数最大取K
    # estimator = KMeans(n_clusters=kbest_slihou,random_state=100,max_iter=500)#构造聚类器
    # estimator.fit(X)
    # label_pred = estimator.labels_
    # cnlinsk = metrics.calinski_harabasz_score(X, label_pred)
    # sili = silhouette_score(X,label_pred,metric='euclidean')
    # print(sili)
    # data['label'] = label_pred
    # expath = "..\\..\\resources/pythonToJava"+'/'+fileName+'聚类（轮廓系数）.csv'
    # outputData = pd.DataFrame(data.loc[:,'label'])
    # outputData.to_csv(expath)

    # # 按经验取K
    # estimator = KMeans(n_clusters=kexpe,random_state=100,max_iter=500)
    # estimator.fit(X)
    # label_pred = estimator.labels_
    # sili = silhouette_score(X,label_pred,metric='euclidean')
    # print(kexpe)
    # print(sili)
    # data['label'] = label_pred
    # outputData = pd.DataFrame(data.loc[:,'label'])
    # expath = "..\\..\\resources/pythonToJava"+'/'+fileName+'聚类（经验）.csv'
    # outputData.to_csv(expath)
    # return data

def getMyKmeans(excelPath):
    origData = pd.read_excel(excelPath,dtype=str)
    origData.set_index(['1'],inplace=True)
    str11 = os.path.split(excelPath)
    fileName = str11[1][:5]
    wenjianjia = str11[0]+"/"+fileName+"-python"
    if(os.path.exists(wenjianjia) == False):
        os.mkdir(wenjianjia)
    myKmeans(origData,fileName,wenjianjia)

# def getMyKmeans(excelName, fawenjianjia):
#     origData = pd.read_excel(excelName, dtype=str)
#     origData.set_index(['1'],inplace=True)
#     fileName = excelName[:5]
#     wenjianjia = fawenjianjia+"/"+fileName+"-python"
#     if(os.path.exists(wenjianjia) == False):
#         os.mkdir(wenjianjia)
#     myKmeans(origData,fileName,wenjianjia)


# if len(sys.argv) == 3:
#     getMyKmeans(sys.argv[1],sys.argv[2])
#
# layer = 6
# filename = "按"+str(layer)+"展开"
#
# # getMyKmeans(r"../../resources/tydPython/0701-1651/按第"+str(layer)+"层展开/forTreePic.xlsx",filename)
# filename = "02312231"
# getMyKmeans(r"D:\华为\Matrix\src\main\resources\tydPython\0231主机模糊矩阵.xlsx",filename)

# 正常程序
getmyk(r"./app/static/uploadGraphcsv/mainStructure/outputTmp/中间过程")
#
# # #java 调用python
# if __name__=="__main__":
#     my_arg = []
#     for i in range(0, len(sys.argv)):
#         my_arg.append(sys.argv[i])
#     result = getmyk(my_arg[1])
