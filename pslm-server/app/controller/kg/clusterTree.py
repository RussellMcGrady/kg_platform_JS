import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import scipy.cluster.hierarchy as shc
import os
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')

# Create some widgets
sourcefile = sys.argv[1]
targetfile = sys.argv[2]
def getCulsterTree(prdModMatPath):
    origData = pd.read_excel(prdModMatPath, sheet_name='Sheet1', header=None)
    data = origData.iloc[1:, 1:].values
    labels = np.arange(1, data.shape[0] + 1)

    plt.figure(figsize=(10, 7))

    plt.title("Product Clustering Tree")
    plt.xlabel('Product Id')
    plt.ylabel('Relative Distance')
    z = shc.linkage(data, method='complete')
    max_dis = np.max(z[:, 2])
    z[:, 2] = z[:, 2] / max_dis

    # str = os.path.split(prdModMatPath)
    dend = shc.dendrogram(z, labels=labels)
    # outPath = "./app/static/uploadGraphcsv/mainStructure/tree.jpg"
    plt.savefig(targetfile)
    # plt.show()
    return None

if __name__ == '__main__':
    path = sourcefile
    getCulsterTree(path)
