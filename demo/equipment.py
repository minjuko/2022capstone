import os
import sys
import urllib.request
import json

from kocrawl.editor.base_editor import BaseEditor
import re

from kocrawl.answerer.base_answerer import BaseAnswerer

#EquipmentSearcher?먯꽌 ?ъ슜-------------------------------------------------------------

client_id = ""
client_secret = ""


#--------------------------------------------------------------------------------------


class EquipmentSearcher:

    def __init__(self):
        self.data_dict = {
            # ?곗씠?곕? ?댁쓣 ?뺤뀛?덈━ 援ъ“瑜??뺤쓽?⑸땲??
            'name': [], 'tel': [],
            'context': [], 'category': [],
            'address': [], 'thumUrl': []
        }

    def _make_query(self, category: str, brand: str) -> str:


        query = ' '.join([category, brand])
        #query = category

        print(query)
        return query

    def search_naver_shopping(self, location: str, travel: str):
        query = self._make_query(location, travel)

        encText = urllib.parse.quote(query)
        url = "https://openapi.naver.com/v1/search/shop?display=5&query=" + encText  # JSON 寃곌낵
        # url = "https://openapi.naver.com/v1/search/blog.xml?query=" + encText # XML 寃곌낵
        request = urllib.request.Request(url)
        request.add_header("X-Naver-Client-Id", client_id)
        request.add_header("X-Naver-Client-Secret", client_secret)
        response = urllib.request.urlopen(request)
        rescode = response.getcode()

        data_dict = [{}]
        # 由ъ뒪??+ ?뺤뀛?덈━

        if (rescode == 200):
            response_body = response.read()
            # print(response_body.decode('utf-8'))
            json_data = json.loads(response_body.decode('utf-8'))

            for i in range(5):
                temp_dict = {"title": json_data["items"][i]["title"],
                             "link": json_data["items"][i]["link"],
                             "image": json_data["items"][i]["image"],
                             "lprice": json_data["items"][i]["lprice"],
                             "category1": json_data["items"][i]["category1"],
                             "category2": json_data["items"][i]["category2"],
                             "category3": json_data["items"][i]["category3"],
                             "brand": json_data["items"][i]["brand"]


                             }
                data_dict.append(temp_dict)

            #print(data_dict[1].values())
            # print(response_body.decode('utf-8'))

        else:
            print("Error Code:" + rescode)

        return data_dict



class EquipmentEditor(BaseEditor):

    def edit_map(self, location: str, place: str, result: dict) -> dict:
        """
        join_dict瑜??ъ슜?섏뿬 ?뺤뀛?덈━???덈뒗 string 諛곗뿴?ㅼ쓣
        ?섎굹??string?쇰줈 join?⑸땲??

        :param location: 吏??
        :param place: ?μ냼
        :param result: ?곗씠???뺤뀛?덈━
        :return: ?섏젙???뺤뀛?덈━
        """

        for i in range(5):

            result[i] = self.join_dict(result[i], "title")
            result[i] = self.join_dict(result[i], "link")
            result[i] = self.join_dict(result[i], "image")
            result[i] = self.join_dict(result[i], 'lprice')

            #if isinstance(result['context'], str):
                #result['context'] = re.sub(' ', ', ', result['context'])

        return result

class EquipmentAnswerer():

    def map_form(self, category: str, brand: str, result: list) -> tuple:
        """
        ?ы뻾吏 異쒕젰 ?щ㎎

        :param location: 吏??
        :param place: ?μ냼
        :param result: ?곗씠???뺤뀛?덈━
        :return: 異쒕젰 硫붿떆吏
        """
        msg_tuple = ["", "",""]
        for i in range(3):

            result[i+1]['title'] = re.sub("<b>", "", result[i+1]['title'])
            result[i + 1]['title'] = re.sub("</b>", "", result[i + 1]['title'])

            msg = f"{result[i + 1]['category1']} - {result[i + 1]['category2']} - {result[i + 1]['category3']} \n"
            msg += f"\'{category}\' 移댄뀒怨좊━??{i + 1}踰덉㎏ 寃?됯껐怨쇱엯?덈떎.\n"
            msg += f"\'{result[i + 1]['brand']}\' 釉뚮옖?쒖쓽 \n"
            msg += f"\'{result[i+1]['title']}\' \n"
            msg += f"理쒖?媛 : {result[i+1]['lprice']}??\n"
            msg += f"諛붾줈媛湲?: {result[i+1]['link']}\n"
            msg += "{{"
            msg += result[i+1]['image']
            msg += "}} \n\n"
            msg_tuple[i] += msg

        return msg_tuple


class EquipmentCrawler:

    def request(self, category: str, brand: str) -> str:
        """
        吏?꾨? ?щ·留곹빀?덈떎.
        (try-catch濡??먮윭媛 ?섏? ?딅뒗 ?⑥닔)

        :param category: ?λ퉬??移댄뀒怨좊━
        :param brand: 釉뚮옖??
        :return: ?대떦 ?λ퉬
        """

        try:
            return self.request_debug(category, brand)

        except Exception:
            return "?대떦 ?λ퉬???????놁뒿?덈떎."

    def request_debug(self, category: str, brand: str) -> tuple:
        result_dict = EquipmentSearcher().search_naver_shopping(category, brand)


        #result = EquipmentEditor().edit_map(category, brand, result_dict)

        result = EquipmentAnswerer().map_form(category, brand, result_dict)
        #return result, result_dict
        temp_result = {
            'input': [],
            'intent': 'equipment',
            'entity': [],
            'state': 'SUCCESS',
            'answer': result
        }

        print(temp_result)

        return temp_result
