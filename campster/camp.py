from kocrawl.base import BaseCrawler
from kocrawl.editor.base_editor import BaseEditor
from kocrawl.answerer.base_answerer import BaseAnswerer
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from pymongo.errors import ServerSelectionTimeoutError
from random import randint


class CampCrawler(BaseCrawler):

    def __today_tag(self,tags:str):
        selected_tags = tags.split(',')
        result = CampSearcher().find_by_tag(selected_tags)
        result = CampEditor().edit_today(result)

        return result


    def __today_location(self, location:str):
        result = CampSearcher().find_by_sigunguNm(location)
        result = CampEditor().edit_today(result)
        return CampAnswerer().camp_form(location=location,result=result)

    def __today_location_place(self, location:str, place:str):

        result = CampSearcher().find_by_sigunguNm_and_lctCl(location=location, lctCl=place)
        result = CampEditor().edit_today(result)
        return CampAnswerer().camp_form(location=location,result=result)


    def request(self,location:str, date:str, place:str):

        try:
            return self.request_debug(location,date,place)
        except Exception:
            return "해당 내용은 알 수 없습니다."


    def request_debug(self, location:str, date:str, place:str):

# location place --> 3
# location  --> 2
        params = []
        select = 0
        select = select + 2 if len(location) > 0 else select
        params.append(location) if len(location) > 0 else ''
        select = select + 1 if len(place) > 0 else select
        params.append(place) if len(place) > 0 else ''
        dispatch = [self.__today_tag,self.__today_location,self.__today_location_place]
        return dispatch[select-1](*params)



class CampAnswerer(BaseAnswerer):

    def camp_form(self, location:str, result:list):
        # msg = self.camp_init.format(location=location)
        #
        # for i,r in enumerate(result):
        #     intro = r['lineIntro']
        #     intro = "" if len(intro)== 0 else ":"+intro
        #     msg +="☆☆"
        #     msg += str((i+1))+"."+r['facltNm']+"캠핑장"+intro+"\n"
        return result



class CampEditor(BaseEditor):

    def __init__(self):
        self.require_field = ['facltNm','lineIntro','addr1','addr2','posblFcltyCl','animalCmgCl','tel','homepage','firstImageUrl','lctCl']

    def edit_today(self, result:list) -> list:

        ret = []
        if result == None:
            return None

        if len(result)>0:
            for r in result:
                camp = {}
                for field in r.keys():
                    if field in self.require_field:
                        camp[field] = r[field]
                ret.append(camp)

            return ret

        else:
            return None




class CampSearcher():

    def mongodb_conn(self):
        client = MongoClient("mongodb://localhost:27017/", connectTimeoutMS=5000,
                             serverSelectionTimeoutMS=5000)
        db = client.kochat.camp
        return db

    def find_by_sigunguNm(self,location: str) -> list:

        db = self.mongodb_conn()

        or_condition_list = []
        or_condition_list.append({'doNm': {'$regex': location}})
        or_condition_list.append({'sigunguNm': {"$regex": location}})

        try:
            result = db.find({"$or": or_condition_list})
            result = list(result)
            size = len(result)
            if size > 0:
                if size > 3:
                    select = randint(0, len(result) - 4)
                    result = result[select:select + 3]
                    return result
                else:
                    return result
            else:
                return None

        except ServerSelectionTimeoutError:
            print('ServerSelctionTimeoutError')
        except ConnectionFailure:
            print('ConnectionFailure Error')

    def find_by_sigunguNm_and_lctCl(self,location: str, lctCl: str) -> list:

        db = self.mongodb_conn()
        search_condition_list = []

        or_condition_list = []
        or_condition_list.append({'doNm': {'$regex': location}})
        or_condition_list.append({'sigunguNm': {"$regex": location}})
        or_result = {'$or': or_condition_list}

        search_condition_list.append(or_result)
        search_condition_list.append({'lctCl': {"$regex": lctCl}})

        try:
            result = db.find({'$and': search_condition_list})
            result = list(result)
            size = len(result)
            if size > 0:
                if size > 3:
                    select = randint(0, len(result) - 4)
                    result = result[select:select + 3]
                    return result
                else:
                    return result

        except ServerSelectionTimeoutError:
            print('ServerSelctionTimeoutError')
        except ConnectionFailure:
            print('ConnectionFailure Error')


    def make_tag_query(self, place: str) -> dict:
        return {'$or': [{'themaEnvrnCl': {'$regex': place}},
                        {'lineIntro': {'$regex': place}}, {'intro': {'$regex': place}},
                        {'featureNm': {'$regex': place}}]}

    def find_by_tag(self,tags):

        db = self.mongodb_conn()
        tag_query_list = []
        for tag in tags:
            tag_query_list.append(self.make_tag_query(tag))


        try:
            res = db.find({'$and': tag_query_list})
            res = list(res)
            size = len(res)
            if size > 0:
                if size > 3:
                    select = randint(0, len(res) - 4)
                    res = res[select:select + 3]
                    return res
                else:
                    return res

        except ServerSelectionTimeoutError:
            print('ServerSelctionTimeoutError')
        except ConnectionFailure:
            print('ConnectionFailure Error')