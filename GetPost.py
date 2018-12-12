import boto3
import os
from boto3.dynamodb.conditions import Key, Attr
def lambda_handler(event, context):
    
    username_email = event["username_email"]
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DB_TABLE_NAME'])
    
    items = table.scan(
        FilterExpression = Key('username_email').eq(username_email)
    )
    
    return items["Items"]
