from django.test import TestCase, Client
import json
from .models import PersonalSetting, ExerciseDefault, ExercisePerUser
from django.contrib.auth.models import User

class FitvoxTestCase(TestCase):
    
    def setUp(self):
        user1 = User.objects.create_user(username='username1', email='email1', password='password1')
        user2 = User.objects.create_user(username='username2', email='email2', password='password2')
        user3 = User.objects.create_user(username='username3', email='email3',password='password3')
        personalsetting1 = PersonalSetting.objects.create(id=1,hardness="1",breaktime='300',user=user1)
        personalsetting2 = PersonalSetting.objects.create(id=2,hardness="2",breaktime='180',user=user2)
        exerciseuser1 = ExercisePerUser.objects.create(user=user1, muscleType='samplemuscle1', exerciseType='sampleextype1',name='samplename', hardness='1', isFavorite=False, volumes={}, oneRMs={})
        exerciseuser2 = ExercisePerUser.objects.create(user=user2, muscleType='samplemuscle2', exerciseType='sampleextype2',name='samplename2',hardness='2', isFavorite=False, volumes={}, oneRMs={})


        
    def test_csrf(self):
        client = Client(enforce_csrf_checks=True)
 
        
        response = client.get('/api/token/')
        self.assertEqual(response.status_code, 204)        
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/signup/', json.dumps({'username': 'username3', 'email':'email3', 'password': 'password3','hardness':'3'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/token/')
        self.assertEqual(response.status_code, 204)        
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/api/signin/', json.dumps({'username': 'username1', 'password': 'password1'}),

                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

        response = client.get('/api/token/')
        self.assertEqual(response.status_code, 204)        
        csrftoken = response.cookies['csrftoken'].value
        response = client.get('/api/psetting/',
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)        






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

        response = client.post('/api/psetting/')
        self.assertEqual(response.status_code,405)

        response = client.delete('/api/psetting/')
        self.assertEqual(response.status_code,405)
        
        response = client.put('/api/exercise_list/')
        self.assertEqual(response.status_code,405)

        response = client.delete('/api/exercise_list/')
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
        
        response = client.get('/api/psetting/', 
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)  
        
                
        response = client.get('/api/exercise_list/',
                                content_type='application/json')
        self.assertEqual(response.status_code, 401)
        
        response = client.put('/api/psetting/', json.dumps({'hardness':'1', 'breaktime':'30'}),
                                content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = client.post('/api/exercise_list/', json.dumps({'muscleType':'Pectoralis', 'exerciseType':'Bench Press', 'name':'SampleWorkout', 'hardness':'1','tags':'sampletag','isFavorite':'False'}),
                                content_type='application/json')
        self.assertEqual(response.status_code, 401)



    def test_notfound(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'username3', 'password':'password3'}),
                                content_type='application/json')
        response = client.get('/api/psetting/',
                                content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.put('/api/psetting/', json.dumps({'hardness':'2', 'breaktime':'30'}),
                                content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/exercise_list/',
                                content_type='application/json')
        self.assertEqual(response.status_code, 404)

   

    def test_signup(self):
        client = Client()
        response = client.post('/api/signup/', json.dumps({'username': 'username7', 'email':'email7@email.mail','password':'password7', 'hardness':'2'}),
                                content_type='application/json')
        self.assertEqual(response.status_code, 201)




    def test_getworks(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'username1', 'password': 'password1'}),
                                content_type='application/json')
        
        response = client.get('/api/psetting/', 
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)  

        response = client.get('/api/exercise_list/',
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_putworks(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username':'username1', 'password':'password1'}),
                                content_type='application/json')

        response = client.put('/api/psetting/', json.dumps({'hardness':'1','breaktime':'30'}),
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_postworks(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username':'username1', 'password':'password1'}),
                                content_type='application/json')

        response = client.post('/api/exercise_list/', json.dumps({'muscleType':'Pectoralis', 'exerciseType':'Bench Press', 'name':'SampleWorkout', 'hardness':'1','tags':'sampletag','isFavorite':'False'}),
                                content_type='application/json')
        self.assertEqual(response.status_code, 204)


    def test_isauth(self):
        client = Client()
        response = client.get('/api/isAuth/',
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = client.post('api/signin/', json.dumps({'username':'username1', 'password':'password1'}),
                                content_type='application/json')
        response = client.get('/api/isAuth/',
                                content_type = 'application/json')
        self.assertEqual(response.status_code, 200)


    def test_integrity(self):
        client = Client()
        response = client.post('/api/signup/', json.dumps({'username':'username1', 'password':'password4','email':'email4', 'hardness':'2'}),
                                content_type='application/json')
        self.assertEqual(response.status_code, 400)
