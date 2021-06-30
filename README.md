# Map Rookie

## 명령어

```bash
# Download Assets
wget http://www.gisdeveloper.co.kr/download/admin_shp/CTPRVN_202101.zip -P ./data &&\
  unzip ./data/CTPRVN_202101.zip -d ./data/CTPRVN &&\
  rm -f ./data/CTPRVN_202101.zip

wget https://www.data.go.kr/download/15013115/standardExcel.do -P ./data -O ./data/charging_station.xls

# Run PostGIS
docker-compose up

# Install postgis
brew install postgis

# SQL
export host=localhost
export port=5432
export user=postgres
export PGPASSWORD=postgres
export dbname=map_rookie

psql -h $host -p $port -U $user -d $dbname -c 'SELECT postgis_version()'
shp2pgsql -I -d -W EUC-KR -s 5179:4326 ./data/CTPRVN/TL_SCCO_CTPRVN.shp ctprvn | psql -h $host -p $port -U $user -d $dbname
```

## 자료

* [대한민국 최신 행정구역(SHP) 다운로드](http://www.gisdeveloper.co.kr/?p=2332)
* [전기차 충전소](https://www.data.go.kr/data/15013115/standard.do)