import boto3
import os
import uuid
def lambda_handler(event, context):
    
    voice = event["voice"]
    text = event["text"]
    title = event["title"]
    property = event["property"]
    username_email = event["username_email"]

    #Creating new record in DynamoDB table
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DB_TABLE_NAME'])
    table.put_item(
        ConditionExpression="attribute_not_exists(username_email)",
        Item={
            'text' : text,
            'voice' : voice,
            'status' : 'PROCESSING',
            'title': title,
            'property': property,
            'username_email': username_email
        }
    )
    
    #Sending notification about new post to SNS
    client = boto3.client('sns')
    client.publish(
        TopicArn = os.environ['SNS_TOPIC'],
        Message = username_email + "," + title,
    )
    
    return username_email + "," + title