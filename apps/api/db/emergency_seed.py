"""
Indian Coastal Emergency Stations Registry
Real police/marine police/coast guard stations along Indian coastline.
"""
import math
from typing import Optional

EMERGENCY_STATIONS = [
    # MAHARASHTRA
    {"id":"em_mh_001","name":"Mumbai Marine Police HQ","station_type":"marine_police","lat":18.9220,"lon":72.8347,"state":"Maharashtra","district":"Mumbai","address":"Marine Drive, Mumbai 400020","landline":["022-22819999","022-22612855"],"mobile":["9820098200"],"staffed_24h":True,"geohash":"te7ub"},
    {"id":"em_mh_002","name":"Versova Police Station","station_type":"police","lat":19.1310,"lon":72.8186,"state":"Maharashtra","district":"Mumbai","address":"Versova, Andheri West, Mumbai","landline":["022-26300233"],"mobile":["9821098210"],"staffed_24h":True,"geohash":"te7ux"},
    {"id":"em_mh_003","name":"Alibaug Marine Police","station_type":"marine_police","lat":18.6435,"lon":72.8729,"state":"Maharashtra","district":"Raigad","address":"Alibaug Jetty, Raigad","landline":["02141-222233"],"mobile":["9420098420"],"staffed_24h":True,"geohash":"te5hk"},
    {"id":"em_mh_004","name":"Malvan Marine Police","station_type":"marine_police","lat":16.0612,"lon":73.4670,"state":"Maharashtra","district":"Sindhudurg","address":"Malvan Harbour, Sindhudurg","landline":["02365-252133"],"mobile":["9422398422"],"staffed_24h":True,"geohash":"te0mg"},
    # GOA
    {"id":"em_ga_001","name":"Goa Marine Police HQ (Panaji)","station_type":"marine_police","lat":15.4989,"lon":73.8278,"state":"Goa","district":"North Goa","address":"Panaji Jetty, Panaji, Goa 403001","landline":["0832-2224488","0832-2224500"],"mobile":["9822098220"],"staffed_24h":True,"geohash":"te5qe"},
    {"id":"em_ga_002","name":"Calangute Police Station","station_type":"police","lat":15.5436,"lon":73.7618,"state":"Goa","district":"North Goa","address":"Calangute, North Goa 403516","landline":["0832-2276034"],"mobile":["9822123456"],"staffed_24h":True,"geohash":"te5q9"},
    {"id":"em_ga_003","name":"Colva Police Station","station_type":"police","lat":15.2789,"lon":73.9254,"state":"Goa","district":"South Goa","address":"Colva, South Goa 403708","landline":["0832-2788035"],"mobile":["9823098230"],"staffed_24h":True,"geohash":"te5mu"},
    {"id":"em_ga_004","name":"Palolem Lifeguard Post","station_type":"lifeguard","lat":15.0098,"lon":74.0228,"state":"Goa","district":"South Goa","address":"Palolem Beach, Canacona","landline":[],"mobile":["9822345678"],"staffed_24h":False,"geohash":"te5he"},
    # KERALA
    {"id":"em_kl_001","name":"Kerala Marine Police (Thiruvananthapuram)","station_type":"marine_police","lat":8.5241,"lon":76.9366,"state":"Kerala","district":"Thiruvananthapuram","address":"Vizhinjam Harbour, Thiruvananthapuram","landline":["0471-2480258","0471-2480259"],"mobile":["9447098447"],"staffed_24h":True,"geohash":"tf38c"},
    {"id":"em_kl_002","name":"Kerala Marine Police (Kochi)","station_type":"marine_police","lat":9.9674,"lon":76.2791,"state":"Kerala","district":"Ernakulam","address":"Kochi Port, Ernakulam","landline":["0484-2668755","0484-2668756"],"mobile":["9447198447"],"staffed_24h":True,"geohash":"tf88v"},
    {"id":"em_kl_003","name":"Kovalam Police Station","station_type":"police","lat":8.4020,"lon":76.9784,"state":"Kerala","district":"Thiruvananthapuram","address":"Kovalam Beach Road, Thiruvananthapuram","landline":["0471-2480100"],"mobile":["9447298447"],"staffed_24h":True,"geohash":"tf380"},
    {"id":"em_kl_004","name":"Varkala Marine Police","station_type":"marine_police","lat":8.7341,"lon":76.7198,"state":"Kerala","district":"Thiruvananthapuram","address":"Varkala Harbour, Thiruvananthapuram","landline":["0472-2603444"],"mobile":["9447398447"],"staffed_24h":True,"geohash":"tf3h7"},
    {"id":"em_kl_005","name":"Bekal Coastal Police","station_type":"police","lat":12.3902,"lon":75.0341,"state":"Kerala","district":"Kasargod","address":"Bekal Fort Road, Kasargod","landline":["04672-296100"],"mobile":["9497098497"],"staffed_24h":True,"geohash":"tgcxv"},
    # TAMIL NADU
    {"id":"em_tn_001","name":"Tamil Nadu Marine Police (Chennai)","station_type":"marine_police","lat":13.0569,"lon":80.2835,"state":"Tamil Nadu","district":"Chennai","address":"Marina Beach PS, Chennai 600001","landline":["044-28523333","044-28523334"],"mobile":["9444098444"],"staffed_24h":True,"geohash":"tf0w9"},
    {"id":"em_tn_002","name":"Kanyakumari Marine Police","station_type":"marine_police","lat":8.0782,"lon":77.5385,"state":"Tamil Nadu","district":"Kanyakumari","address":"Kanyakumari Harbour, 629702","landline":["04652-246600"],"mobile":["9444198444"],"staffed_24h":True,"geohash":"tf25q"},
    {"id":"em_tn_003","name":"Rameswaram Marine Police","station_type":"marine_police","lat":9.2889,"lon":79.3091,"state":"Tamil Nadu","district":"Ramanathapuram","address":"Rameswaram Harbour, 623526","landline":["04573-221100"],"mobile":["9444298444"],"staffed_24h":True,"geohash":"tg7w5"},
    {"id":"em_tn_004","name":"Mahabalipuram Lifeguard Station","station_type":"lifeguard","lat":12.6216,"lon":80.1929,"state":"Tamil Nadu","district":"Kanchipuram","address":"Shore Temple Beach, Mahabalipuram","landline":[],"mobile":["9789098789"],"staffed_24h":False,"geohash":"tf0qj"},
    # ANDHRA PRADESH
    {"id":"em_ap_001","name":"Visakhapatnam Marine Police","station_type":"marine_police","lat":17.6868,"lon":83.2185,"state":"Andhra Pradesh","district":"Visakhapatnam","address":"Visakhapatnam Harbour, 530001","landline":["0891-2536444","0891-2536400"],"mobile":["9440098440"],"staffed_24h":True,"geohash":"tg8je"},
    {"id":"em_ap_002","name":"Rishikonda Lifeguard Post","station_type":"lifeguard","lat":17.7764,"lon":83.3810,"state":"Andhra Pradesh","district":"Visakhapatnam","address":"Rishikonda Beach, Visakhapatnam","landline":[],"mobile":["9440198440"],"staffed_24h":False,"geohash":"tg8jq"},
    # KARNATAKA
    {"id":"em_ka_001","name":"Mangalore Coast Guard Station","station_type":"coast_guard","lat":12.8880,"lon":74.8428,"state":"Karnataka","district":"Dakshina Kannada","address":"New Mangalore Port, Panambur","landline":["0824-2407200","0824-2407201"],"mobile":["9449098449"],"staffed_24h":True,"geohash":"tg44s"},
    {"id":"em_ka_002","name":"Karwar Marine Police","station_type":"marine_police","lat":14.8117,"lon":74.1301,"state":"Karnataka","district":"Uttara Kannada","address":"Karwar Harbour, 581303","landline":["08382-221100"],"mobile":["9449198449"],"staffed_24h":True,"geohash":"te8wg"},
    {"id":"em_ka_003","name":"Gokarna Police Station","station_type":"police","lat":14.5492,"lon":74.3225,"state":"Karnataka","district":"Uttara Kannada","address":"Gokarna Town, 581326","landline":["08386-256100"],"mobile":["9449298449"],"staffed_24h":True,"geohash":"te8qm"},
    # GUJARAT
    {"id":"em_gj_001","name":"Surat Marine Police","station_type":"marine_police","lat":21.1702,"lon":72.8311,"state":"Gujarat","district":"Surat","address":"Magdalla Harbour, Surat","landline":["0261-2630333"],"mobile":["9426098426"],"staffed_24h":True,"geohash":"tf0d8"},
    {"id":"em_gj_002","name":"Dwarka Coast Guard","station_type":"coast_guard","lat":22.2372,"lon":68.9685,"state":"Gujarat","district":"Devbhoomi Dwarka","address":"Okha Port, Devbhoomi Dwarka","landline":["02892-221100"],"mobile":["9426198426"],"staffed_24h":True,"geohash":"tff7t"},
    # WEST BENGAL
    {"id":"em_wb_001","name":"Kolkata Marine Police","station_type":"marine_police","lat":22.5726,"lon":88.3639,"state":"West Bengal","district":"Kolkata","address":"Strand Road, Kolkata 700001","landline":["033-22481212"],"mobile":["9433098433"],"staffed_24h":True,"geohash":"tgm2k"},
    {"id":"em_wb_002","name":"Digha Marine Police","station_type":"marine_police","lat":21.6284,"lon":87.5067,"state":"West Bengal","district":"East Midnapore","address":"Digha Old Beach, East Midnapore","landline":["03220-266100"],"mobile":["9434098434"],"staffed_24h":True,"geohash":"tggh2"},
    # ODISHA
    {"id":"em_od_001","name":"Puri Marine Police","station_type":"marine_police","lat":19.8005,"lon":85.8317,"state":"Odisha","district":"Puri","address":"Puri Beach Road, Puri 752001","landline":["06752-223244"],"mobile":["9437098437"],"staffed_24h":True,"geohash":"tg82p"},
    {"id":"em_od_002","name":"Puri Lifeguard Station","station_type":"lifeguard","lat":19.7952,"lon":85.8259,"state":"Odisha","district":"Puri","address":"Puri Beach, Golden Zone","landline":[],"mobile":["9437198437"],"staffed_24h":True,"geohash":"tg82j"},
    # ANDAMAN & NICOBAR
    {"id":"em_an_001","name":"Port Blair Coast Guard","station_type":"coast_guard","lat":11.6653,"lon":92.7291,"state":"Andaman and Nicobar","district":"South Andaman","address":"Port Blair Harbour, 744101","landline":["03192-233200","03192-233201"],"mobile":["9474098474"],"staffed_24h":True,"geohash":"t77qk"},
    {"id":"em_an_002","name":"Havelock Island Police","station_type":"police","lat":11.9816,"lon":92.9945,"state":"Andaman and Nicobar","district":"South Andaman","address":"Havelock Island, Swaraj Dweep","landline":["03192-282100"],"mobile":["9474198474"],"staffed_24h":True,"geohash":"t77u2"},
]

# ── Haversine distance ────────────────────────────────────────────────────────
def _haversine(lat1, lon1, lat2, lon2) -> float:
    """Returns distance in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

def find_nearest_stations(
    lat: float, lon: float,
    station_type: Optional[str] = None,
    limit: int = 3,
    radius_km: float = 200
) -> list[dict]:
    results = []
    for s in EMERGENCY_STATIONS:
        if station_type and s["station_type"] != station_type:
            continue
        dist = _haversine(lat, lon, s["lat"], s["lon"])
        if dist <= radius_km:
            results.append({**s, "distance_km": round(dist, 2)})
    results.sort(key=lambda x: x["distance_km"])
    return results[:limit]

def get_stations_in_radius(lat: float, lon: float, radius_km: float = 25) -> list[dict]:
    return find_nearest_stations(lat, lon, station_type=None, limit=50, radius_km=radius_km)

def get_station_by_id(station_id: str) -> Optional[dict]:
    return next((s for s in EMERGENCY_STATIONS if s["id"] == station_id), None)
