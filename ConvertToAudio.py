import boto3
import os
from contextlib import closing
from boto3.dynamodb.conditions import Key, Attr
def lambda_handler(event, context):
    postId = event["Records"][0]["Sns"]["Message"]
    
    print "Text to Speech function. Post ID in DynamoDB: " + postId
    
    #Retrieving information about the post from DynamoDB table
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DB_TABLE_NAME'])
    postItem = table.query(
        KeyConditionExpression=Key('id').eq(postId)
    )
    text = postItem["Items"][0]["text"]
    voice = postItem["Items"][0]["voice"] 
    
    #Invoke Polly API, which will transform text into audio
    polly = boto3.client('polly')
    response = polly.start_speech_synthesis_task(VoiceId=voice,
                OutputS3BucketName='hipolly-audiofiles',
                OutputFormat='mp3', 
                Text = text)

    taskId = response['SynthesisTask']['TaskId']

    print "Task id is {} ".format(taskId)

    task_status = polly.get_speech_synthesis_task(TaskId = taskId)

    print task_status
        
    url = task_status['SynthesisTask']['OutputUri']
            
    #Updating the item in DynamoDB
    response = table.update_item(
        Key={'id':postId},
          UpdateExpression=
            "SET #statusAtt = :statusValue, #urlAtt = :urlValue",                   
          ExpressionAttributeValues=
            {':statusValue': 'UPDATED', ':urlValue': url},
        ExpressionAttributeNames=
          {'#statusAtt': 'status', '#urlAtt': 'url'},
    )
        
    return
