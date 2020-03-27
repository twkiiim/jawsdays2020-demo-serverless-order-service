#
# Cautions
#
# Since both OrderModel(pynamodb) and boto3 refers from 
# AWS credentials set on your local machine,
# check if the AWS region on your local profile has been set to 
# the intended region.
#
# For this demo, ap-northeast-1 (Tokyo) is used.
#

import sys
sys.path.append('..')

from model.order import OrderModel

# OrderModel.delete_table()
OrderModel.create_table()

import boto3
sqs = boto3.resource('sqs')
queue = sqs.create_queue(QueueName='jawsdays2020_demo_order_queue')
