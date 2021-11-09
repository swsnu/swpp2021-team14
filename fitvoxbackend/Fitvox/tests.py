from django.test import TestCase, Client
import json
from .models import PersonalSetting, ExerciseDefault, ExercisePerUser
from django.contrib.auth.models import User

class FitvoxTestCase(TestCase):
    
    def setUp(self):
        user1 = User.objects.create_user(username='username1', email='email1', password='password1')
        user2 = User.objects.create_user(username='username2', email='email2', password='password2')
        personalsetting1 = PersonalSetting.objects.create(id=1,hardness="1",breaktime='300',user=user1)
        personalsetting2 = PersonalSetting.objects.create(id=2,hardness="2",breaktime='180',user=user2)
        


        
    def test_csrf(self):
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup/', json.dumps({'username':'username3', 'email':'email3', 'password':'password3','hardness':'2','breaktime':'240'}),
                content_type='application/json')
        self.assertEqual(response.status_code, 403)

 
        
        response = client.get('/api/token')
        self.assertEqual(response.status_code, 301)        
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/signup/', json.dumps({'username': 'username3', 'email':'email3', 'password': 'password3','hardness':'3','breaktime':'60'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/token')
        self.assertEqual(response.status_code, 204)        
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/signin/', json.dumps({'username': 'username1', 'password': 'password1'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/token')
        self.assertEqual(response.status_code, 204)        
        csrftoken = response.cookies['csrftoken'].value
        response = client.get('/api/psetting/',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)        






    def test_notallowed(self):
        client = Client()

        response = client.delete('/api/token/')
        self.assertEqual(response.status_code,405)

        response = client.get('/api/signup/')
        self.assertEqual(response.status_code,405)

        response = client.put('/api/signup/')
        self.assertEqual(response.status_code,405)

        response = client.delete('/api/signup/')
        self.assertEqual(response.status_code,405)

        response = client.get('/api/signin/')
        self.assertEqual(response.status_code,405)

        response = client.put('/api/signin/')
        self.assertEqual(response.status_code,405)

        response = client.delete('/api/signin/')
        self.assertEqual(response.status_code,405)

        response = client.post('/api/signout/')
        self.assertEqual(response.status_code,405)

        response = client.put('/api/signout/')
        self.assertEqual(response.status_code,405)

        response = client.delete('/api/signout/')
        self.assertEqual(response.status_code,405)

        response = client.post('/api/user/1/psetting/')
        self.assertEqual(response.status_code,405)

        response = client.delete('/api/user/1/psetting/')
        self.assertEqual(response.status_code,405)

    def test_signinerror(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'errorname', 'password': 'wrongpass'}),
                               content_type='application/json')
        self.assertEqual(response.status_code,401)

    def test_signout(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'username1', 'password': 'password1'}),
                               content_type='application/json')
        response = client.get('/api/signout/')
        self.assertEqual(response.status_code,204)
        response = client.get('/api/signout/')
        self.assertEqual(response.status_code,401)

    def test_notsignedin(self):
        client = Client()
        
        response = client.get('/api/user/1/psetting/', 
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)  

    def test_getworks(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'username1', 'password': 'password1'}),
                                content_type='application/json')
        
        response = client.get('/api/user/1/psetting/', 
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)  

    
    def test_notfound(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'username1', 'password': 'password1'}),
                                content_type='application/json')

        response = client.get('/api/user/404/psetting/', 
                               content_type='application/json')
        self.assertEqual(response.status_code, 404) 

        response = client.put('/api/user/404/psetting/', json.dumps({'hardness': '2', 'breaktime': '240'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 404) 

    def test_forbidden(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'username1', 'password': 'password1'}),
                                content_type='application/json')

        response = client.put('/api/user/2/psetting/', json.dumps({'hardness': '2', 'breaktime': '240'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)     

        
