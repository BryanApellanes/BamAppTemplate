

DAYDIR=`date "+%Y-%m-%d"`
echo DAYDIR=$DAYDIR

# test
aws s3 cp --recursive s3://bsi-dev-import ./test/$DAYDIR/bsi-dev-import
aws s3 cp --recursive s3://dev-rates-cache ./test/$DAYDIR/dev-rates-cache

# stable
aws s3 cp --recursive s3://bsi-stable-import ./stable/$DAYDIR/bsi-stable-import 
aws s3 cp --recursive s3://stable-rates-cache ./stable/$DAYDIR/stable-rates-cache 

#proj05 
aws s3 cp --recursive s3://product-rates-data.proj05.prod.simon365.com ./proj05/$DAYDIR/product-rates-data.proj05.prod.simon365.com --profile prod
aws s3 cp --recursive s3://product-rates-cache.proj05.prod.simon365.com ./proj05/$DAYDIR/product-rates-cache.proj05.prod.simon365.com --profile prod
	
#staging
aws s3 cp --recursive s3://product-rates-data.staging.prod.simon365.com ./staging/$DAYDIR/product-rates-data.staging.prod.simon365.com --profile prod
aws s3 cp --recursive s3://product-rates-cache.staging.prod.simon365.com ./staging/$DAYDIR/product-rates-cache.staging.prod.simon365.com --profile prod

#prod
aws s3 cp --recursive s3://product-rates-data.prod.prod.simon365.com ./prod/$DAYDIR/product-rates-data.prod.prod.simon365.com --profile prod
aws s3 cp --recursive s3://product-rates-cache.prod.prod.simon365.com ./prod/$DAYDIR/product-rates-cache.prod.prod.simon365.com --profile prod



