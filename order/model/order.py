import enum
import uuid
import datetime
import pytz

from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute, BooleanAttribute
from pynamodb.constants import STREAM_NEW_AND_OLD_IMAGE

local_tz = pytz.timezone('Asia/Tokyo')

class OrderStatusEnum(enum.IntEnum):
    INITIALIZED = 0
    SUCCEEDED = 100
    FAILED = 200

class TransactionStatusEnum(enum.IntEnum):
    INITIALIZED = 0
    DONE = 100


class OrderModel(Model):

    class Meta:
        table_name = 'jawsdays2020_demo_order'
        region = 'ap-northeast-1'
        read_capacity_units = 1
        write_capacity_units = 1

    id = UnicodeAttribute(hash_key=True)
    orderStatus = NumberAttribute(null=False)
    transactionStatus = NumberAttribute(null=False)
    paymentId = UnicodeAttribute(null=False)
    createdAt = UnicodeAttribute(null=False)

    itemId = NumberAttribute(null=False)
    title = UnicodeAttribute(null=False)
    subtitle = UnicodeAttribute(null=False)
    price = NumberAttribute(null=False)
    


    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def init(self):
        now = datetime.datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(local_tz).strftime('%Y-%m-%d %H:%M:%S')

        self.id = str(uuid.uuid4())
        self.orderStatus = OrderStatusEnum.INITIALIZED
        self.transactionStatus = TransactionStatusEnum.INITIALIZED
        self.createdAt = now


    def to_dict(self):
        rval = {}
        for key in self.attribute_values:
            rval[key] = self.__getattribute__(key)
        return rval

    def save(self):
        super().save()