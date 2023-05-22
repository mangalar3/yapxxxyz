from pymongo import MongoClient
import requests as rq
import requests
import numpy as np
from selenium.webdriver.chrome.options import Options
from datetime import datetime
from bs4 import BeautifulSoup   
import time
import sys,os
from re import search
import shutil
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from itertools import * 
from requests_html import HTMLSession

headers = {
"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
'Content-Type': 'application/json',
"server": "LiteSpeed",
"access-control-allow-origin": "https://www.elektromarketim.com/",
"access-control-allow-headers": "X-Requested-With, Authorization, Content-Type, ORIGIN",
"x-robots-tag": "noindex",
"x-xss-protection": "1; mode=block"
}

def listToString(s):
 
    # initialize an empty string
    str1 = ""
    i = 0
    # traverse in the string
    for ele in s:
        if i % 3 == 0:
            str1 += ele+"\n"
        else:
            str1 += ele
        i += 1
    # return string
    return str1
def get_database():
 
   # Provide the mongodb atlas url to connect python to mongodb using pymongo
   CONNECTION_STRING = "mongodb+srv://yapx:JaxMaster03@cluster0.62duuxx.mongodb.net/yapx"
 
   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient(CONNECTION_STRING)
 
   # Create the database for our example (we will use the same database throughout the tutorial
   return client['yapx']
  
# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":   
  
   # Get the database
   dbname = get_database()
   collection_name = dbname["urunler"]
try:
    urunler = collection_name.find({"product_category3":"Islak Zemin Yalıtım Malzemeleri "})
    for item in urunler:
        try:
            category = item['product_category3']
            print(category)
            for foto in item['product_photo']:
                original = rf'{foto}'
                target = f'./{category}'
                if not os.path.exists(target):   
                    os.makedirs(target)
                os.makedirs(os.path.dirname(target), exist_ok=True)
                shutil.move(original, target.strip())
        except  Exception as hata:
            print(hata)
except Exception as hata:
    print(hata)



