/**
 * Shorecast — Complete Indian Beach Dataset
 * 130+ beaches across 12 states/UTs with nearby data
 */

export interface NearbyItem {
  name: string;
  type: string;
  rating: number;
  distance: string;
  description: string;
  mapsQuery: string;
}

export interface BeachData {
  id: string;
  name: string;
  state: string;
  region: string;
  lat: number;
  lon: number;
  description: string;
  tags: string[];
  best_season: string;
  suitability_score: number;
  rating: number;
  heroImage: string;
  nearby: {
    hotels: NearbyItem[];
    restaurants: NearbyItem[];
    famousPlaces: NearbyItem[];
  };
}

// ─── State-level nearby data ───────────────────────────────────────────────

const NEARBY: Record<string, { hotels: NearbyItem[]; restaurants: NearbyItem[]; famousPlaces: NearbyItem[] }> = {
  "Maharashtra-Mumbai": {
    hotels: [
      { name: "Taj Mahal Palace", type: "5-Star Luxury", rating: 4.9, distance: "3.2 km", description: "Iconic heritage hotel overlooking the Gateway of India.", mapsQuery: "Taj+Mahal+Palace+Mumbai" },
      { name: "The Oberoi Mumbai", type: "5-Star Luxury", rating: 4.8, distance: "2.1 km", description: "Stunning sea-facing rooms with panoramic Arabian Sea views.", mapsQuery: "Oberoi+Mumbai" },
      { name: "Holiday Inn Mumbai", type: "4-Star", rating: 4.2, distance: "1.5 km", description: "Modern business hotel with rooftop pool and beach access.", mapsQuery: "Holiday+Inn+Mumbai+beach" },
    ],
    restaurants: [
      { name: "Trishna", type: "Coastal Seafood", rating: 4.7, distance: "2.8 km", description: "Legendary Mumbai restaurant famous for butter garlic crab.", mapsQuery: "Trishna+Mumbai" },
      { name: "Khyber", type: "North Indian", rating: 4.6, distance: "3.5 km", description: "Iconic fort area restaurant with Mughal decor and kebabs.", mapsQuery: "Khyber+Mumbai" },
      { name: "Bastian", type: "Seafood & Grill", rating: 4.8, distance: "1.2 km", description: "Upscale seafood restaurant known for lobster and oysters.", mapsQuery: "Bastian+Mumbai" },
    ],
    famousPlaces: [
      { name: "Gateway of India", type: "Monument", rating: 4.7, distance: "4.1 km", description: "Iconic 1924 arch monument overlooking Mumbai Harbour.", mapsQuery: "Gateway+of+India" },
      { name: "Elephanta Caves", type: "UNESCO Heritage", rating: 4.5, distance: "9 km (ferry)", description: "5th-century rock-cut Shiva sculptures on Elephanta Island.", mapsQuery: "Elephanta+Caves+Mumbai" },
      { name: "Siddhivinayak Temple", type: "Temple", rating: 4.8, distance: "5.2 km", description: "Mumbai's most revered Ganesha temple visited by millions.", mapsQuery: "Siddhivinayak+Temple+Mumbai" },
    ],
  },
  "Maharashtra-Raigad": {
    hotels: [
      { name: "Radisson Blu Alibaug", type: "4-Star Resort", rating: 4.5, distance: "0.8 km", description: "Luxury resort with private beach and Ayurvedic spa.", mapsQuery: "Radisson+Alibaug" },
      { name: "Saffron Beach Resort", type: "3-Star", rating: 4.1, distance: "1.4 km", description: "Family resort with beach-facing cottages and seafood dining.", mapsQuery: "Saffron+Beach+Resort+Alibaug" },
      { name: "Coconut Beach Resort", type: "Boutique", rating: 4.3, distance: "0.6 km", description: "Eco-friendly cottages with garden views and organic meals.", mapsQuery: "Coconut+Beach+Resort+Alibaug" },
    ],
    restaurants: [
      { name: "Maratha Kitchen", type: "Malvani Seafood", rating: 4.6, distance: "0.5 km", description: "Authentic Konkan fish curry, sol kadhi, and prawn dishes.", mapsQuery: "Maratha+Kitchen+Alibaug" },
      { name: "The Fisherman's Wharf", type: "Seafood", rating: 4.5, distance: "1.1 km", description: "Beachside shack famous for fresh pomfret and crab.", mapsQuery: "Fishermans+Wharf+Alibaug" },
      { name: "Sea Shell Restaurant", type: "Multi-cuisine", rating: 4.2, distance: "0.9 km", description: "Ocean-view dining with both Indian and continental options.", mapsQuery: "Sea+Shell+Restaurant+Alibaug" },
    ],
    famousPlaces: [
      { name: "Kolaba Fort", type: "Sea Fort", rating: 4.6, distance: "1.5 km", description: "17th-century Maratha sea fort accessible during low tide.", mapsQuery: "Kolaba+Fort+Alibaug" },
      { name: "Janjira Fort", type: "Heritage Fort", rating: 4.7, distance: "45 km", description: "Impregnable sea fort — the only one never conquered in India.", mapsQuery: "Janjira+Fort+Murud" },
      { name: "Kihim Beach Bird Sanctuary", type: "Nature", rating: 4.3, distance: "12 km", description: "Protected bird sanctuary with migratory species in winter.", mapsQuery: "Kihim+Bird+Sanctuary" },
    ],
  },
  "Maharashtra-Sindhudurg": {
    hotels: [
      { name: "MTDC Tarkarli Resort", type: "Government Resort", rating: 4.2, distance: "0.3 km", description: "Well-maintained government resort right on Tarkarli beach.", mapsQuery: "MTDC+Tarkarli+Resort" },
      { name: "Chivla Beach Resort", type: "3-Star", rating: 4.4, distance: "2 km", description: "Boutique property with kayaking and dolphin-watching tours.", mapsQuery: "Chivla+Beach+Resort+Malvan" },
      { name: "Sindhudurg Beach Huts", type: "Eco Huts", rating: 4.1, distance: "0.5 km", description: "Affordable beach-facing huts perfect for backpackers.", mapsQuery: "Sindhudurg+Beach+Huts" },
    ],
    restaurants: [
      { name: "Hotel Chaitanya", type: "Malvani", rating: 4.7, distance: "1.2 km", description: "Best Malvani thali in Malvan — try the fish curry rice.", mapsQuery: "Hotel+Chaitanya+Malvan" },
      { name: "Athithi Bamboo Restaurant", type: "Coastal", rating: 4.5, distance: "0.7 km", description: "Bamboo-themed open-air restaurant serving fresh catch.", mapsQuery: "Athithi+Bamboo+Restaurant+Tarkarli" },
      { name: "Devbagh Seafood Shack", type: "Seafood", rating: 4.4, distance: "1.5 km", description: "Fresh clams, crabs, and squids cooked Konkan-style.", mapsQuery: "Devbagh+Seafood" },
    ],
    famousPlaces: [
      { name: "Sindhudurg Fort", type: "Sea Fort", rating: 4.8, distance: "3 km (boat)", description: "Magnificent 17th-century Maratha fort built by Shivaji Maharaj.", mapsQuery: "Sindhudurg+Fort" },
      { name: "Scuba Diving Centre Malvan", type: "Adventure", rating: 4.6, distance: "2.5 km", description: "Top-rated scuba diving with coral reefs and marine life.", mapsQuery: "Scuba+Diving+Malvan" },
      { name: "Rock Garden Malvan", type: "Garden", rating: 4.0, distance: "1.8 km", description: "Seaside garden with sculptures and lighthouse views.", mapsQuery: "Rock+Garden+Malvan" },
    ],
  },
  "Maharashtra-Ratnagiri": {
    hotels: [
      { name: "MTDC Ganpatipule Resort", type: "Government Resort", rating: 4.3, distance: "0.4 km", description: "Beachfront rooms with direct access to Ganpatipule beach.", mapsQuery: "MTDC+Ganpatipule" },
      { name: "The Mango House", type: "Heritage Stay", rating: 4.5, distance: "2 km", description: "Traditional Konkan house with Alphonso mango orchards.", mapsQuery: "Mango+House+Ratnagiri" },
      { name: "Sea Breeze Resort Guhagar", type: "3-Star", rating: 4.2, distance: "0.6 km", description: "Simple, comfortable rooms steps from the beach.", mapsQuery: "Sea+Breeze+Resort+Guhagar" },
    ],
    restaurants: [
      { name: "Hotel Abhishek", type: "Malvani", rating: 4.5, distance: "1.0 km", description: "Famous for Ratna fish thali and homemade sol kadhi.", mapsQuery: "Hotel+Abhishek+Ratnagiri" },
      { name: "Kokan Kinara", type: "Coastal Konkan", rating: 4.4, distance: "1.5 km", description: "Authentic coastal food with stunning sea-facing tables.", mapsQuery: "Kokan+Kinara+Ratnagiri" },
      { name: "Ganesh Fish Stall", type: "Street Food", rating: 4.3, distance: "0.3 km", description: "Best fried Bombil (Bombay Duck) and prawn fritters.", mapsQuery: "Ganesh+Fish+Stall+Ganpatipule" },
    ],
    famousPlaces: [
      { name: "Ganpatipule Temple", type: "Temple", rating: 4.9, distance: "0.1 km", description: "400-year-old self-emerged Ganpati idol right on the beach.", mapsQuery: "Ganpatipule+Temple" },
      { name: "Prachin Konkan Museum", type: "Museum", rating: 4.4, distance: "2 km", description: "Fascinating exhibits on Konkan coastal heritage and history.", mapsQuery: "Prachin+Konkan+Museum" },
      { name: "Jaigad Fort", type: "Heritage Fort", rating: 4.3, distance: "14 km", description: "Portuguese-era fort at the confluence of Shastri River and sea.", mapsQuery: "Jaigad+Fort+Ratnagiri" },
    ],
  },
  "Tamil Nadu-Chennai": {
    hotels: [
      { name: "ITC Grand Chola", type: "5-Star Luxury", rating: 4.8, distance: "8 km", description: "Majestic Chola-inspired luxury hotel with world-class dining.", mapsQuery: "ITC+Grand+Chola+Chennai" },
      { name: "Taj Coromandel", type: "5-Star", rating: 4.7, distance: "6 km", description: "Elegant heritage hotel in the heart of Chennai's business district.", mapsQuery: "Taj+Coromandel+Chennai" },
      { name: "Crowne Plaza ECR", type: "4-Star Beach Resort", rating: 4.5, distance: "1.5 km", description: "Beach resort on East Coast Road with stunning ocean views.", mapsQuery: "Crowne+Plaza+Chennai+ECR" },
    ],
    restaurants: [
      { name: "Murugan Idli Shop", type: "South Indian Breakfast", rating: 4.7, distance: "3 km", description: "Iconic soft idlis and crispy dosas — a Chennai institution.", mapsQuery: "Murugan+Idli+Shop+Chennai" },
      { name: "Peshawri (ITC)", type: "North Indian / Kebabs", rating: 4.8, distance: "8 km", description: "Award-winning Dal Bukhara and tandoor dishes.", mapsQuery: "Peshawri+ITC+Chennai" },
      { name: "Copper Chimney", type: "Multi-cuisine", rating: 4.4, distance: "4 km", description: "Popular family restaurant with great coastal Tamil Nadu specials.", mapsQuery: "Copper+Chimney+Chennai" },
    ],
    famousPlaces: [
      { name: "Kapaleeshwarar Temple", type: "Temple", rating: 4.8, distance: "4 km", description: "Stunning 7th-century Dravidian temple with a colourful gopuram.", mapsQuery: "Kapaleeshwarar+Temple+Chennai" },
      { name: "Fort St. George", type: "Heritage Monument", rating: 4.5, distance: "3.5 km", description: "India's first English fort (1644) with a museum of colonial relics.", mapsQuery: "Fort+St+George+Chennai" },
      { name: "Government Museum Chennai", type: "Museum", rating: 4.6, distance: "5 km", description: "One of India's oldest museums with bronze Chola sculptures.", mapsQuery: "Government+Museum+Chennai" },
    ],
  },
  "Tamil Nadu-Kanyakumari": {
    hotels: [
      { name: "Hotel Sparsa Kanyakumari", type: "3-Star", rating: 4.4, distance: "0.5 km", description: "Sea-facing rooms with sunrise and sunset views over three oceans.", mapsQuery: "Hotel+Sparsa+Kanyakumari" },
      { name: "KTDC Sea View Hotel", type: "Government Hotel", rating: 4.0, distance: "0.3 km", description: "Affordable government hotel steps from the tip of India.", mapsQuery: "KTDC+Kanyakumari" },
      { name: "The Lemon Tree Hotel", type: "4-Star", rating: 4.5, distance: "1.2 km", description: "Modern hotel with sea view pool and multicuisine restaurant.", mapsQuery: "Lemon+Tree+Hotel+Kanyakumari" },
    ],
    restaurants: [
      { name: "Hotel Saravana Bhavan", type: "South Indian", rating: 4.6, distance: "0.8 km", description: "Famous for sambar, rasam, and the iconic South Indian meals.", mapsQuery: "Saravana+Bhavan+Kanyakumari" },
      { name: "Archana Restaurant", type: "Seafood", rating: 4.5, distance: "0.4 km", description: "Fresh seafood curry and grilled fish facing the ocean.", mapsQuery: "Archana+Restaurant+Kanyakumari" },
      { name: "Hotel Sangam", type: "Multi-cuisine", rating: 4.3, distance: "1.0 km", description: "Popular local eatery with Tamil Nadu and Kerala cuisines.", mapsQuery: "Hotel+Sangam+Kanyakumari" },
    ],
    famousPlaces: [
      { name: "Vivekananda Rock Memorial", type: "Monument / Spiritual", rating: 4.8, distance: "0.5 km (ferry)", description: "Rock memorial where Swami Vivekananda meditated in 1892.", mapsQuery: "Vivekananda+Rock+Memorial" },
      { name: "Thiruvalluvar Statue", type: "Statue", rating: 4.7, distance: "0.6 km (ferry)", description: "133-foot statue of Tamil poet Thiruvalluvar on a tiny island.", mapsQuery: "Thiruvalluvar+Statue+Kanyakumari" },
      { name: "Kanyakumari Devi Temple", type: "Temple", rating: 4.9, distance: "0.1 km", description: "Ancient temple of Devi Kanyakumari — one of 51 Shakti Peethas.", mapsQuery: "Kanyakumari+Temple" },
    ],
  },
  "Kerala-Thiruvananthapuram": {
    hotels: [
      { name: "Leela Kovalam", type: "5-Star Luxury", rating: 4.8, distance: "1.2 km", description: "Cliff-top luxury resort with infinity pools over the Arabian Sea.", mapsQuery: "Leela+Kovalam+Beach+Hotel" },
      { name: "Taj Green Cove Kovalam", type: "5-Star", rating: 4.7, distance: "0.9 km", description: "Lush tropical resort nestled in coconut groves facing the sea.", mapsQuery: "Taj+Green+Cove+Kovalam" },
      { name: "Uday Samudra Beach Hotel", type: "4-Star", rating: 4.4, distance: "0.4 km", description: "Ayurvedic spa hotel with private beach access and yoga classes.", mapsQuery: "Uday+Samudra+Kovalam" },
    ],
    restaurants: [
      { name: "Fusion Restaurant (Leela)", type: "Multi-cuisine Fine Dining", rating: 4.8, distance: "1.2 km", description: "Cliff-top fine dining with panoramic sea views and Kerala cuisine.", mapsQuery: "Fusion+Restaurant+Leela+Kovalam" },
      { name: "Suprabhatham", type: "Kerala Breakfast", rating: 4.6, distance: "2 km", description: "Authentic appam, puttu, and fish moilee breakfast experience.", mapsQuery: "Suprabhatham+Trivandrum" },
      { name: "Malabar Café Kovalam", type: "Seafood", rating: 4.5, distance: "0.5 km", description: "Beach café known for grilled kingfish and prawn masala.", mapsQuery: "Malabar+Cafe+Kovalam" },
    ],
    famousPlaces: [
      { name: "Padmanabhaswamy Temple", type: "Temple / Heritage", rating: 4.9, distance: "12 km", description: "World's wealthiest temple — Lord Vishnu reclining on Ananta Shesha.", mapsQuery: "Padmanabhaswamy+Temple+Trivandrum" },
      { name: "Kovalam Lighthouse", type: "Lighthouse", rating: 4.6, distance: "0.8 km", description: "118-step lighthouse offering 360-degree coastal panoramas.", mapsQuery: "Kovalam+Lighthouse" },
      { name: "Napier Museum", type: "Museum", rating: 4.4, distance: "13 km", description: "19th-century museum with bronze idols, ivory carvings, and Kerala murals.", mapsQuery: "Napier+Museum+Trivandrum" },
    ],
  },
  "Kerala-Alappuzha": {
    hotels: [
      { name: "Houseboat Stay (Alleppey)", type: "Houseboat", rating: 4.8, distance: "2 km", description: "Luxury kettuvallam houseboat cruise through Kerala backwaters.", mapsQuery: "Houseboat+Alleppey+backwaters" },
      { name: "Marari Beach Resort (CGH Earth)", type: "5-Star Eco Resort", rating: 4.9, distance: "0.3 km", description: "Award-winning eco resort by a pristine Kerala beach.", mapsQuery: "Marari+Beach+Resort+CGH" },
      { name: "Raheem Residency", type: "Heritage Hotel", rating: 4.7, distance: "1.5 km", description: "1868 colonial bungalow hotel with antique furniture and garden.", mapsQuery: "Raheem+Residency+Alleppey" },
    ],
    restaurants: [
      { name: "Chakara Restaurant", type: "Kerala Cuisine", rating: 4.7, distance: "1.0 km", description: "Award-winning restaurant for authentic Kerala seafood and kuttanadan duck.", mapsQuery: "Chakara+Restaurant+Alleppey" },
      { name: "Harbourview Restaurant", type: "Seafood", rating: 4.5, distance: "0.8 km", description: "Canal-side dining with karimeen (pearl spot) fish specialties.", mapsQuery: "Harbourview+Restaurant+Alleppey" },
      { name: "Aryaas Hotel", type: "Kerala Vegetarian", rating: 4.4, distance: "2 km", description: "Traditional Kerala sadya on banana leaf — an authentic feast.", mapsQuery: "Aryaas+Hotel+Alleppey" },
    ],
    famousPlaces: [
      { name: "Alleppey Backwaters", type: "Natural Wonder", rating: 4.9, distance: "0.5 km", description: "Kerala's famous network of canals, lakes, and lagoons.", mapsQuery: "Alleppey+Backwaters" },
      { name: "Nehru Trophy Boat Race Venue", type: "Cultural Site", rating: 4.6, distance: "1.2 km", description: "Punnamada Lake — venue of the world-famous snake boat races.", mapsQuery: "Punnamada+Lake+Alleppey" },
      { name: "Kumarakom Bird Sanctuary", type: "Wildlife Sanctuary", rating: 4.5, distance: "15 km", description: "Chilika of Kerala — migratory birds flock in winter months.", mapsQuery: "Kumarakom+Bird+Sanctuary" },
    ],
  },
  "Kerala-Ernakulam": {
    hotels: [
      { name: "Brunton Boatyard (CGH Earth)", type: "Heritage Hotel", rating: 4.9, distance: "0.8 km", description: "19th-century shipyard converted to an award-winning heritage hotel.", mapsQuery: "Brunton+Boatyard+Kochi" },
      { name: "The Malabar Hotel", type: "4-Star", rating: 4.6, distance: "1.0 km", description: "Fort Kochi landmark with Dutch-era architecture and bay views.", mapsQuery: "Malabar+Hotel+Kochi" },
      { name: "Grand Hyatt Kochi Bolgatty", type: "5-Star Island Hotel", rating: 4.7, distance: "3 km", description: "Palace hotel on Bolgatty Island with golf course and marina.", mapsQuery: "Grand+Hyatt+Bolgatty+Kochi" },
    ],
    restaurants: [
      { name: "Kashi Art Café", type: "Café / All-day Dining", rating: 4.7, distance: "0.4 km", description: "Fort Kochi's iconic breakfast café with ginger coffee and Kerala snacks.", mapsQuery: "Kashi+Art+Cafe+Fort+Kochi" },
      { name: "Oceanos", type: "Seafood Fine Dining", rating: 4.8, distance: "1 km", description: "Upscale seafood with Malabar-style fish preparations.", mapsQuery: "Oceanos+Kochi" },
      { name: "Dal Roti", type: "North Indian", rating: 4.5, distance: "2 km", description: "Popular restaurant known for buttery dals and tandoor specials.", mapsQuery: "Dal+Roti+Kochi" },
    ],
    famousPlaces: [
      { name: "Chinese Fishing Nets", type: "Cultural Icon", rating: 4.7, distance: "0.1 km", description: "400-year-old Chinese cantilevered fishing nets at Fort Kochi shore.", mapsQuery: "Chinese+Fishing+Nets+Kochi" },
      { name: "Mattancherry Palace", type: "Heritage Museum", rating: 4.5, distance: "3 km", description: "Dutch-era palace with stunning Kerala murals and Raja's artifacts.", mapsQuery: "Mattancherry+Palace+Kochi" },
      { name: "Jew Town Spice Market", type: "Market / Heritage", rating: 4.6, distance: "3 km", description: "Centuries-old spice trading streets with antique shops.", mapsQuery: "Jew+Town+Kochi" },
    ],
  },
  "Andhra Pradesh-Visakhapatnam": {
    hotels: [
      { name: "Novotel Visakhapatnam", type: "5-Star", rating: 4.7, distance: "1.5 km", description: "Luxury beachfront hotel with rooftop pool and spa.", mapsQuery: "Novotel+Visakhapatnam+Varun+Beach" },
      { name: "The Park Visakhapatnam", type: "5-Star Boutique", rating: 4.6, distance: "2 km", description: "Boutique hotel known for its contemporary design and seafood restaurant.", mapsQuery: "The+Park+Visakhapatnam" },
      { name: "Fortune Hotel Srilanka", type: "4-Star", rating: 4.3, distance: "3 km", description: "Well-maintained hotel near Rushikonda with sea-view dining.", mapsQuery: "Fortune+Hotel+Visakhapatnam" },
    ],
    restaurants: [
      { name: "Dwaraka", type: "Andhra Seafood", rating: 4.7, distance: "2 km", description: "Famous for Andhra-style fish curry and prawn vepudu.", mapsQuery: "Hotel+Dwaraka+Visakhapatnam" },
      { name: "Masala Bay (Novotel)", type: "Multi-cuisine", rating: 4.6, distance: "1.5 km", description: "Beachfront restaurant with live cooking stations and Andhra specials.", mapsQuery: "Masala+Bay+Novotel+Vizag" },
      { name: "Bamboo Garden Restaurant", type: "Chinese & Thai", rating: 4.4, distance: "3 km", description: "Scenic outdoor dining in a bamboo grove setting.", mapsQuery: "Bamboo+Garden+Visakhapatnam" },
    ],
    famousPlaces: [
      { name: "INS Kurusura Submarine Museum", type: "Museum", rating: 4.7, distance: "4 km", description: "Decommissioned Russian submarine converted to a unique museum.", mapsQuery: "INS+Kurusura+Submarine+Museum+Vizag" },
      { name: "Araku Valley", type: "Hill Station", rating: 4.8, distance: "115 km", description: "Scenic Andhra hill station with coffee estates and tribal culture.", mapsQuery: "Araku+Valley+Visakhapatnam" },
      { name: "Borra Caves", type: "Natural Wonder", rating: 4.6, distance: "90 km", description: "Million-year-old stalactite and stalagmite cave formations.", mapsQuery: "Borra+Caves+Andhra" },
    ],
  },
  "Karnataka-Uttara Kannada": {
    hotels: [
      { name: "Namaste Café & Guesthouse", type: "Beachside Huts", rating: 4.5, distance: "0.2 km", description: "Iconic Om Beach guesthouse with simple huts and rooftop yoga.", mapsQuery: "Namaste+Cafe+Om+Beach+Gokarna" },
      { name: "SwaSwara Resort", type: "Luxury Eco Resort", rating: 4.9, distance: "1.5 km", description: "Award-winning wellness resort with yoga, art, and ayurveda.", mapsQuery: "SwaSwara+Resort+Gokarna" },
      { name: "The Zostel Gokarna", type: "Backpacker Hostel", rating: 4.5, distance: "0.5 km", description: "Vibrant social hostel steps from Gokarna's main beach.", mapsQuery: "Zostel+Gokarna" },
    ],
    restaurants: [
      { name: "Pai Hotel Gokarna", type: "South Indian", rating: 4.5, distance: "1 km", description: "Classic South Indian meals, idli, and fish thali. A local staple.", mapsQuery: "Pai+Hotel+Gokarna" },
      { name: "Mantra Café Om Beach", type: "Café / Fusion", rating: 4.6, distance: "0.3 km", description: "Hippy café on Om Beach known for banana pancakes and chai.", mapsQuery: "Mantra+Cafe+Om+Beach" },
      { name: "Dolphin Bay Restaurant", type: "Seafood", rating: 4.4, distance: "0.8 km", description: "Fresh grilled fish and prawn dishes on the cliffside.", mapsQuery: "Dolphin+Bay+Restaurant+Gokarna" },
    ],
    famousPlaces: [
      { name: "Mahabaleshwar Temple", type: "Temple", rating: 4.9, distance: "1.2 km", description: "Ancient Shiva temple housing the self-emerged Atmalinga — one of India's most sacred shrines.", mapsQuery: "Mahabaleshwar+Temple+Gokarna" },
      { name: "Yana Rocks", type: "Natural Wonder", rating: 4.7, distance: "55 km", description: "Massive monolithic karst limestone formations in a lush forest.", mapsQuery: "Yana+Rocks+Karnataka" },
      { name: "Mirjan Fort", type: "Heritage Fort", rating: 4.4, distance: "20 km", description: "16th-century Vijayanagara fort with nature trails through ruins.", mapsQuery: "Mirjan+Fort+Karnataka" },
    ],
  },
  "Karnataka-Udupi": {
    hotels: [
      { name: "Valley View International Hotel", type: "3-Star", rating: 4.3, distance: "2 km", description: "Clean, comfortable hotel near Malpe Beach and Udupi town.", mapsQuery: "Valley+View+Hotel+Udupi" },
      { name: "Ideal Beach Resort Malpe", type: "Beach Resort", rating: 4.5, distance: "0.4 km", description: "Spacious rooms with garden views and a pool near the beach.", mapsQuery: "Ideal+Beach+Resort+Malpe" },
      { name: "The Ocean Pearl Udupi", type: "4-Star", rating: 4.4, distance: "5 km", description: "Modern hotel with rooftop restaurant and Udupi cuisine.", mapsQuery: "Ocean+Pearl+Udupi" },
    ],
    restaurants: [
      { name: "Mitra Samaj", type: "Traditional Udupi", rating: 4.8, distance: "6 km", description: "96-year-old pure vegetarian restaurant where Udupi cuisine was born.", mapsQuery: "Mitra+Samaj+Udupi" },
      { name: "Hotel Woodlands Udupi", type: "South Indian", rating: 4.5, distance: "5.5 km", description: "Famous for crispy Udupi dosas, bisi bele bath, and masala vada.", mapsQuery: "Hotel+Woodlands+Udupi" },
      { name: "Uncle's Kitchen Malpe", type: "Seafood", rating: 4.4, distance: "0.6 km", description: "Fresh catch from the Malpe fishing harbour — prawns, crabs, fish.", mapsQuery: "Uncles+Kitchen+Malpe" },
    ],
    famousPlaces: [
      { name: "Krishna Math Udupi", type: "Temple", rating: 4.9, distance: "6 km", description: "800-year-old temple complex founded by Sri Madhvacharya. Sacred Krishna idol.", mapsQuery: "Krishna+Math+Udupi" },
      { name: "St. Mary's Island", type: "Geological Monument", rating: 4.7, distance: "0.5 km (boat)", description: "National Geological Monument — hexagonal basalt columns formed 88 million years ago.", mapsQuery: "St+Marys+Island+Udupi" },
      { name: "Manipal University Museum", type: "Museum", rating: 4.3, distance: "8 km", description: "Fascinating museum with geology, anatomy, and natural history exhibits.", mapsQuery: "Manipal+Museum" },
    ],
  },
  "Karnataka-Mangalore": {
    hotels: [
      { name: "Hotel Goldfinch Mangalore", type: "4-Star", rating: 4.5, distance: "3 km", description: "Business hotel with a rooftop pool and multi-cuisine restaurant.", mapsQuery: "Hotel+Goldfinch+Mangalore" },
      { name: "Taj Gateway Hotel Mangalore", type: "4-Star", rating: 4.6, distance: "4 km", description: "Heritage Taj property in Mangalore's business district.", mapsQuery: "Taj+Gateway+Mangalore" },
      { name: "Pabbas Beach Hotel", type: "3-Star", rating: 4.2, distance: "0.8 km", description: "Budget-friendly hotel near Panambur Beach with clean rooms.", mapsQuery: "Pabbas+Hotel+Mangalore" },
    ],
    restaurants: [
      { name: "Shanthis Restaurant", type: "Mangalorean Seafood", rating: 4.7, distance: "2 km", description: "Famous for Mangalorean fish curry, ghee roast crab, and prawn gassi.", mapsQuery: "Shanthis+Restaurant+Mangalore" },
      { name: "Pabbas Ice Cream", type: "Desserts / Snacks", rating: 4.8, distance: "3 km", description: "Mangalore's iconic ice cream parlour since 1935 — must-visit.", mapsQuery: "Pabbas+Ice+Cream+Mangalore" },
      { name: "Hotel Srinivas", type: "Udupi Cuisine", rating: 4.5, distance: "4 km", description: "Authentic South Canara meals and breakfast since decades.", mapsQuery: "Hotel+Srinivas+Mangalore" },
    ],
    famousPlaces: [
      { name: "Kadri Manjunath Temple", type: "Temple", rating: 4.7, distance: "5 km", description: "11th-century hilltop temple with bronze Lokeshwara idol — rare Tantric shrine.", mapsQuery: "Kadri+Manjunath+Temple+Mangalore" },
      { name: "Sultan Bathery", type: "Heritage Site", rating: 4.3, distance: "6 km", description: "18th-century Tipu Sultan's battery fortress overlooking the sea.", mapsQuery: "Sultan+Bathery+Mangalore" },
      { name: "Shree Venkataramana Temple", type: "Temple", rating: 4.6, distance: "4 km", description: "Renowned temple with Vijayanagara-style architecture in the city centre.", mapsQuery: "Venkataramana+Temple+Mangalore" },
    ],
  },
  "Gujarat-Devbhoomi Dwarka": {
    hotels: [
      { name: "Dwarka Hotel Gokul", type: "3-Star", rating: 4.3, distance: "1 km", description: "Pilgrimage hotel near the Dwarkadhish Temple with clean rooms.", mapsQuery: "Hotel+Gokul+Dwarka" },
      { name: "Rukmini Dwarkadhish Hotel", type: "3-Star", rating: 4.2, distance: "0.8 km", description: "Well-maintained hotel serving simple vegetarian meals.", mapsQuery: "Rukmini+Hotel+Dwarka" },
      { name: "Shivrajpur Beach Camp", type: "Eco Camp", rating: 4.5, distance: "0.3 km", description: "Beachside tents with snorkelling gear and guided marine walks.", mapsQuery: "Shivrajpur+Beach+Camp+Dwarka" },
    ],
    restaurants: [
      { name: "Prem Bhojanalay", type: "Rajasthani-Gujarati Veg", rating: 4.5, distance: "1.5 km", description: "Pure vegetarian thali with dal baati churma and unlimited refills.", mapsQuery: "Prem+Bhojanalay+Dwarka" },
      { name: "Govardhan Food Plaza", type: "Street Food", rating: 4.3, distance: "0.5 km", description: "Famous for Gujarati farsan, dhokla, and refreshing chaas.", mapsQuery: "Govardhan+Food+Plaza+Dwarka" },
      { name: "Dwarkadhish Prasadam", type: "Temple Prasad", rating: 4.7, distance: "0.2 km", description: "The iconic sweet prasad from the Dwarkadhish Temple trust.", mapsQuery: "Dwarkadhish+Temple+Dwarka" },
    ],
    famousPlaces: [
      { name: "Dwarkadhish Temple", type: "Char Dham / Temple", rating: 4.9, distance: "2 km", description: "One of the four sacred Char Dham — the Kingdom of Lord Krishna.", mapsQuery: "Dwarkadhish+Temple+Dwarka" },
      { name: "Bet Dwarka Island", type: "Pilgrimage Island", rating: 4.7, distance: "6 km (ferry)", description: "Sacred island where Lord Krishna actually resided. Accessible by ferry.", mapsQuery: "Bet+Dwarka+Island" },
      { name: "Nageshwar Jyotirlinga", type: "Jyotirlinga Temple", rating: 4.8, distance: "17 km", description: "One of India's 12 Jyotirlingas — a major Shiva pilgrimage site.", mapsQuery: "Nageshwar+Jyotirlinga+Dwarka" },
    ],
  },
  "Gujarat-Kutch": {
    hotels: [
      { name: "The Gateway Hotel Mandvi Beach", type: "4-Star", rating: 4.5, distance: "0.5 km", description: "Elegant beachfront hotel near the historic Vijay Vilas Palace.", mapsQuery: "Gateway+Hotel+Mandvi+Beach" },
      { name: "Rann Riders Resort", type: "Heritage Camp", rating: 4.6, distance: "85 km (Rann)", description: "Luxury tents during Rann Utsav with cultural performances.", mapsQuery: "Rann+Riders+Resort+Kutch" },
      { name: "Hotel Kutch Mandvi", type: "3-Star", rating: 4.1, distance: "2 km", description: "Budget hotel with Kutch decor and local Kutchi cuisine.", mapsQuery: "Hotel+Kutch+Mandvi" },
    ],
    restaurants: [
      { name: "Osho Restaurant Mandvi", type: "Kutchi Cuisine", rating: 4.5, distance: "1 km", description: "Try Kutchi dabeli, kadhi, and the famous dal dhokli here.", mapsQuery: "Osho+Restaurant+Mandvi" },
      { name: "Vijay Vilas Palace Restaurant", type: "Royal Dining", rating: 4.7, distance: "3 km", description: "Dine in a former royal palace with Indo-Saracenic architecture.", mapsQuery: "Vijay+Vilas+Palace+Mandvi" },
      { name: "Bhujodi Dhaba", type: "Rural Gujarati", rating: 4.4, distance: "5 km", description: "Village-style Gujarati thali with fresh rotis and seasonal veggies.", mapsQuery: "Bhujodi+Dhaba+Kutch" },
    ],
    famousPlaces: [
      { name: "Vijay Vilas Palace", type: "Heritage Palace", rating: 4.8, distance: "3 km", description: "Stunning sand-stone palace of the Kutch royal family set in 450 acres.", mapsQuery: "Vijay+Vilas+Palace+Mandvi" },
      { name: "Kutch Museum", type: "Museum", rating: 4.5, distance: "60 km (Bhuj)", description: "Gujarat's oldest museum with Kutchi embroidery, fossils, and arms.", mapsQuery: "Kutch+Museum+Bhuj" },
      { name: "Rann of Kutch", type: "Natural Wonder", rating: 4.9, distance: "85 km", description: "World's largest salt flat — spectacular under full moon in the Rann Utsav.", mapsQuery: "Rann+of+Kutch" },
    ],
  },
  "Goa-North Goa": {
    hotels: [
      { name: "W Goa", type: "5-Star Luxury", rating: 4.8, distance: "3 km", description: "Ultra-luxury beachfront hotel with world-class dining and beach club.", mapsQuery: "W+Hotel+Goa+Vagator" },
      { name: "Taj Fort Aguada Resort & Spa", type: "5-Star Heritage", rating: 4.9, distance: "5 km", description: "Iconic heritage resort inside a 17th-century Portuguese fort.", mapsQuery: "Taj+Fort+Aguada+Goa" },
      { name: "Zostel Goa Baga", type: "Party Hostel", rating: 4.6, distance: "0.2 km", description: "Social hostel near Baga with a rooftop bar and nightly events.", mapsQuery: "Zostel+Goa+Baga" },
    ],
    restaurants: [
      { name: "A Reverie", type: "Fine Dining European", rating: 4.8, distance: "4 km", description: "Boutique garden restaurant in a 100-year-old Portuguese home.", mapsQuery: "A+Reverie+Goa+Calangute" },
      { name: "Tito's Goa", type: "Bar & Grill", rating: 4.5, distance: "0.3 km", description: "Goa's most legendary nightlife spot and beach restaurant.", mapsQuery: "Titos+Goa+Baga" },
      { name: "Gunpowder Goa", type: "South Indian", rating: 4.8, distance: "8 km (Assagao)", description: "Chef Jiggs Kalra's restaurant — home-style South Indian with a modern twist.", mapsQuery: "Gunpowder+Restaurant+Goa" },
    ],
    famousPlaces: [
      { name: "Anjuna Flea Market", type: "Market", rating: 4.6, distance: "5 km", description: "Iconic Wednesday flea market with clothing, handicrafts, and antiques.", mapsQuery: "Anjuna+Flea+Market+Goa" },
      { name: "Chapora Fort", type: "Heritage Fort", rating: 4.5, distance: "7 km", description: "Fort famously seen in Dil Chahta Hai — panoramic views of Vagator.", mapsQuery: "Chapora+Fort+Goa" },
      { name: "Basilica of Bom Jesus", type: "UNESCO Heritage", rating: 4.8, distance: "12 km", description: "UNESCO site holding the mortal remains of St. Francis Xavier.", mapsQuery: "Basilica+of+Bom+Jesus+Goa" },
    ],
  },
  "Goa-South Goa": {
    hotels: [
      { name: "The Leela Goa", type: "5-Star Resort", rating: 4.9, distance: "2 km", description: "Sprawling luxury resort on Mobor beach with a private lagoon.", mapsQuery: "The+Leela+Goa+Cavelossim" },
      { name: "Radisson Blu Goa", type: "5-Star", rating: 4.7, distance: "3 km", description: "Beachfront resort with multiple pools and a world-class spa.", mapsQuery: "Radisson+Blu+Goa+Cavelossim" },
      { name: "Ciaran's Camp Palolem", type: "Beach Huts", rating: 4.7, distance: "0.1 km", description: "Beautiful wooden huts right on Palolem Beach with a top café.", mapsQuery: "Ciarans+Camp+Palolem" },
    ],
    restaurants: [
      { name: "Fisherman's Wharf", type: "Goan Seafood", rating: 4.7, distance: "3 km", description: "Iconic waterfront restaurant on the Sal River with fresh Goan catch.", mapsQuery: "Fishermans+Wharf+Goa+Cavelossim" },
      { name: "Café del Mar Palolem", type: "Beach Café", rating: 4.5, distance: "0.5 km", description: "Cliff-top café known for its silent disco, sundowners, and pizza.", mapsQuery: "Cafe+del+Mar+Palolem" },
      { name: "Dropadi Restaurant", type: "Goan-Indian", rating: 4.4, distance: "1 km", description: "Goan fish curry rice, prawn balchão, and arroz doce.", mapsQuery: "Dropadi+Restaurant+Palolem" },
    ],
    famousPlaces: [
      { name: "Dudhsagar Falls", type: "Waterfall", rating: 4.9, distance: "60 km", description: "India's 5th tallest waterfall — a stunning 4-tier, 310m cascade.", mapsQuery: "Dudhsagar+Falls+Goa" },
      { name: "Cabo de Rama Fort", type: "Heritage Fort", rating: 4.6, distance: "15 km", description: "Goa's oldest fort with Portuguese ruins and wild sea views.", mapsQuery: "Cabo+de+Rama+Fort+Goa" },
      { name: "Cotigao Wildlife Sanctuary", type: "Wildlife", rating: 4.5, distance: "12 km", description: "Dense forest sanctuary with giant squirrels, bison, and leopards.", mapsQuery: "Cotigao+Wildlife+Sanctuary+Goa" },
    ],
  },
  "West Bengal-East Midnapore": {
    hotels: [
      { name: "Hotel Tara Palace Digha", type: "3-Star", rating: 4.2, distance: "0.5 km", description: "Comfortable sea-view hotel in Old Digha with a restaurant.", mapsQuery: "Hotel+Tara+Palace+Digha" },
      { name: "Mandarmani Beach Resort", type: "Beach Resort", rating: 4.4, distance: "0.2 km", description: "Cosy resort right on the famous motorable beach of Mandarmani.", mapsQuery: "Mandarmani+Beach+Resort" },

      { name: "Henry Island Nature Camp", type: "Eco Camp", rating: 4.5, distance: "40 km", description: "Forest department cottages inside mangrove reserve at Henry's Island.", mapsQuery: "Henry+Island+Nature+Camp" },
    ],
    restaurants: [
      { name: "Seagull Restaurant Digha", type: "Bengali Seafood", rating: 4.4, distance: "0.8 km", description: "Famous for hilsa fish curry, prawn malai curry, and Bengali thali.", mapsQuery: "Seagull+Restaurant+Digha" },
      { name: "Mukta Restaurant", type: "Seafood & Bengali", rating: 4.3, distance: "1.2 km", description: "Known for Digha-style prawn fry and crab preparations.", mapsQuery: "Mukta+Restaurant+Digha" },
      { name: "Crab House Mandarmani", type: "Crab Speciality", rating: 4.5, distance: "0.4 km", description: "Fresh red crabs and seafood BBQ on the beachfront.", mapsQuery: "Crab+House+Mandarmani" },
    ],
    famousPlaces: [
      { name: "Marine Aquarium Digha", type: "Aquarium", rating: 4.3, distance: "2 km", description: "Coastal research institute aquarium with local marine life exhibits.", mapsQuery: "Marine+Aquarium+Digha" },
      { name: "Tajpur Virgin Beach", type: "Eco Beach", rating: 4.6, distance: "15 km", description: "Pristine turtle-nesting beach with minimal development — a real gem.", mapsQuery: "Tajpur+Beach+West+Bengal" },
      { name: "Bishnupur Terracotta Temples", type: "Heritage", rating: 4.7, distance: "150 km", description: "16th-century terracotta temples — UNESCO-nominated Malla dynasty art.", mapsQuery: "Bishnupur+Temples+West+Bengal" },
    ],
  },
  "Odisha-Puri": {
    hotels: [
      { name: "Mayfair Heritage Puri", type: "5-Star Heritage", rating: 4.7, distance: "1 km", description: "Converted heritage bungalow hotel with Odisha-style architecture.", mapsQuery: "Mayfair+Heritage+Puri" },
      { name: "Toshali Sands Ethnic Resort", type: "4-Star", rating: 4.5, distance: "0.8 km", description: "Traditional Odisha-style eco resort with cultural programmes.", mapsQuery: "Toshali+Sands+Puri" },
      { name: "Hotel Hans Coco Palms", type: "3-Star", rating: 4.2, distance: "0.5 km", description: "Budget beachfront hotel with a good restaurant and pool.", mapsQuery: "Hans+Coco+Palms+Puri" },
    ],
    restaurants: [
      { name: "Peace Restaurant Puri", type: "Oriya Cuisine", rating: 4.5, distance: "1 km", description: "Known for traditional Oriya dalma, pakhala bhata, and machha jhola.", mapsQuery: "Peace+Restaurant+Puri" },
      { name: "Wildgrass Restaurant", type: "Multi-cuisine", rating: 4.4, distance: "2 km", description: "Garden restaurant with a la carte and Oriya thali options.", mapsQuery: "Wildgrass+Restaurant+Puri" },
      { name: "Mahabhoj Restaurant", type: "Oriya Veg", rating: 4.6, distance: "0.5 km", description: "Famous for Jagannath Mahaprasad — the sacred food of Lord Jagannath.", mapsQuery: "Mahabhoj+Restaurant+Puri" },
    ],
    famousPlaces: [
      { name: "Jagannath Temple Puri", type: "Char Dham Temple", rating: 4.9, distance: "2 km", description: "12th-century Char Dham — non-Hindus not admitted but the soaring kalasha is visible.", mapsQuery: "Jagannath+Temple+Puri" },
      { name: "Konark Sun Temple", type: "UNESCO Heritage", rating: 4.9, distance: "36 km", description: "13th-century UNESCO temple chariot of the Sun God — an architectural marvel.", mapsQuery: "Konark+Sun+Temple" },
      { name: "Chilika Lake", type: "Natural Wonder / Lagoon", rating: 4.8, distance: "50 km", description: "Asia's largest coastal lagoon with Irrawaddy dolphins and migratory birds.", mapsQuery: "Chilika+Lake+Odisha" },
    ],
  },
  "Puducherry-Puducherry": {
    hotels: [
      { name: "Le Pondy Boutique Hotel", type: "Boutique Heritage", rating: 4.7, distance: "0.5 km", description: "French Creole house hotel in the White Town with a pool.", mapsQuery: "Le+Pondy+Hotel+Pondicherry" },
      { name: "Palais de Mahé", type: "5-Star Heritage", rating: 4.9, distance: "1 km", description: "18th-century French colonial mansion converted to a luxury hotel.", mapsQuery: "Palais+de+Mahe+Pondicherry" },
      { name: "The Promenade Hotel", type: "4-Star", rating: 4.6, distance: "0.2 km", description: "Seafront hotel directly on the iconic French Promenade.", mapsQuery: "The+Promenade+Pondicherry" },
    ],
    restaurants: [
      { name: "Le Café (Promenade)", type: "French & Indian", rating: 4.7, distance: "0.1 km", description: "Iconic sea-facing café on the promenade — morning croissants and filter coffee.", mapsQuery: "Le+Cafe+Promenade+Pondicherry" },
      { name: "Surguru Restaurant", type: "South Indian", rating: 4.5, distance: "2 km", description: "Best Tamil meals in Pondicherry — known for payasam and fresh idlis.", mapsQuery: "Surguru+Restaurant+Pondicherry" },
      { name: "Villa Shanti", type: "French-Indian Fusion", rating: 4.8, distance: "1.5 km", description: "Garden bistro in a heritage house — signature French-Indian fusion menu.", mapsQuery: "Villa+Shanti+Pondicherry" },
    ],
    famousPlaces: [
      { name: "Auroville Matrimandir", type: "Spiritual Centre", rating: 4.8, distance: "10 km", description: "Stunning golden sphere — centre of the international township of Auroville.", mapsQuery: "Auroville+Matrimandir" },
      { name: "Sri Aurobindo Ashram", type: "Ashram / Heritage", rating: 4.7, distance: "1 km", description: "Serene ashram of Sri Aurobindo — a centre for yoga and spirituality.", mapsQuery: "Sri+Aurobindo+Ashram+Pondicherry" },
      { name: "French Quarter (White Town)", type: "Heritage District", rating: 4.8, distance: "0.5 km", description: "Charming colonial streets with French villas, cafés, and boutiques.", mapsQuery: "French+Quarter+Pondicherry" },
    ],
  },
  "Andaman and Nicobar Islands-Andaman": {
    hotels: [
      { name: "Barefoot at Havelock", type: "Eco Luxury Resort", rating: 4.9, distance: "1 km", description: "Award-winning eco resort near Radhanagar Beach with tented villas.", mapsQuery: "Barefoot+at+Havelock+Andaman" },
      { name: "Munjoh Ocean Resort", type: "5-Star", rating: 4.8, distance: "0.8 km", description: "Upscale resort with glass-bottom kayaks and snorkelling packages.", mapsQuery: "Munjoh+Ocean+Resort+Havelock" },
      { name: "Symphony Palms Beach Resort", type: "4-Star", rating: 4.6, distance: "0.5 km", description: "Comfortable island resort with diving school and sea-view rooms.", mapsQuery: "Symphony+Palms+Havelock" },
    ],
    restaurants: [
      { name: "Anju Coco Resto Havelock", type: "Seafood & Multi-cuisine", rating: 4.7, distance: "2 km", description: "Island institution known for fresh tuna steaks and grilled lobster.", mapsQuery: "Anju+Coco+Resto+Havelock" },
      { name: "Mandalay Restaurant (Barefoot)", type: "Fine Dining", rating: 4.8, distance: "1 km", description: "Elegant beachside fine dining with Asian-Indian fusion cuisine.", mapsQuery: "Mandalay+Restaurant+Havelock+Andaman" },
      { name: "Fat Martin's Restaurant", type: "Seafood & Bakery", rating: 4.5, distance: "3 km", description: "Popular for fresh baked bread, seafood platters, and cold coffee.", mapsQuery: "Fat+Martins+Havelock+Andaman" },
    ],
    famousPlaces: [
      { name: "Radhanagar Beach (Beach 7)", type: "Best Beach in Asia", rating: 4.9, distance: "0", description: "Repeatedly voted Asia's best beach — pristine turquoise waters.", mapsQuery: "Radhanagar+Beach+Havelock+Andaman" },
      { name: "Cellular Jail", type: "National Monument", rating: 4.8, distance: "50 km (Port Blair)", description: "Colonial prison — site of the freedom fighters' struggle. Light & Sound Show daily.", mapsQuery: "Cellular+Jail+Port+Blair" },
      { name: "North Bay Coral Reef", type: "Snorkelling / Diving", rating: 4.7, distance: "15 km (boat)", description: "Spectacular coral reef with sea turtles, clownfish, and manta rays.", mapsQuery: "North+Bay+Island+Andaman" },
    ],
  },
  "Lakshadweep-Lakshadweep": {
    hotels: [
      { name: "Bangaram Island Resort", type: "5-Star Island Resort", rating: 4.9, distance: "on-island", description: "All-inclusive island resort with water bungalows and dive centre.", mapsQuery: "Bangaram+Island+Resort+Lakshadweep" },
      { name: "Agatti Island Beach Resort", type: "4-Star", rating: 4.7, distance: "0.3 km", description: "Lagoon-facing resort with snorkelling, diving, and windsurfing.", mapsQuery: "Agatti+Island+Beach+Resort" },
      { name: "Lacadives (Kadmat)", type: "Eco Resort", rating: 4.6, distance: "0.2 km", description: "Simple eco-resort on the virgin Kadmat Island with pristine lagoon.", mapsQuery: "Lacadives+Kadmat+Lakshadweep" },
    ],
    restaurants: [
      { name: "Bangaram Resort Dining", type: "Seafood Fine Dining", rating: 4.8, distance: "on-island", description: "Fresh island seafood — lobster, tuna, and octopus prepared to order.", mapsQuery: "Bangaram+Island+Resort+Restaurant" },
      { name: "Local Lagoon Shack Minicoy", type: "Mahl Cuisine", rating: 4.5, distance: "0.5 km", description: "Try traditional Minicoy tuna dishes — influence of Maldivian culture.", mapsQuery: "Minicoy+Thundi+Beach+restaurant" },
      { name: "Agatti Café", type: "Island Café", rating: 4.4, distance: "0.2 km", description: "Fresh coconut water, grilled fish, and local coconut-based curries.", mapsQuery: "Agatti+Island+café" },
    ],
    famousPlaces: [
      { name: "Bangaram Lagoon", type: "Lagoon / Snorkelling", rating: 4.9, distance: "0.1 km", description: "Crystal-clear atoll lagoon — teeming with coral, sea turtles, and rays.", mapsQuery: "Bangaram+Atoll+Lakshadweep" },
      { name: "Minicoy Lighthouse", type: "Lighthouse / Heritage", rating: 4.7, distance: "1 km", description: "1885 British-built lighthouse — one of the tallest in India.", mapsQuery: "Minicoy+Lighthouse+Lakshadweep" },
      { name: "Kavaratti Mosque & Aquarium", type: "Cultural / Aquarium", rating: 4.5, distance: "60 km (Kavaratti)", description: "Exquisite 52-mosque island capital with a marine aquarium and turtle hatchery.", mapsQuery: "Kavaratti+Island+Lakshadweep" },
    ],
  },
};

function getNearby(state: string, region: string) {
  const key = `${state}-${region}`;
  if (NEARBY[key]) return NEARBY[key];
  // Fallback by state
  const stateKey = Object.keys(NEARBY).find(k => k.startsWith(state));
  if (stateKey) return NEARBY[stateKey];
  return {
    hotels: [
      { name: `${region} Beach Resort`, type: "3-Star", rating: 4.2, distance: "0.5 km", description: "Comfortable rooms near the beach with essential amenities.", mapsQuery: `beach+resort+${region}` },
      { name: "Coastal Inn", type: "Budget Hotel", rating: 4.0, distance: "1.2 km", description: "Clean, affordable rooms popular with travellers.", mapsQuery: `hotel+${region}` },
      { name: "Seaside Lodge", type: "Guesthouse", rating: 4.1, distance: "0.8 km", description: "Family-run guesthouse with home-cooked meals.", mapsQuery: `guesthouse+${region}` },
    ],
    restaurants: [
      { name: "The Fisherman's Catch", type: "Seafood", rating: 4.4, distance: "0.3 km", description: "Fresh daily catch — grilled fish, prawn masala, and crab curry.", mapsQuery: `seafood+restaurant+${region}` },
      { name: "Coastal Dhaba", type: "Indian", rating: 4.2, distance: "0.6 km", description: "Authentic regional cuisine with local spices and fresh ingredients.", mapsQuery: `dhaba+${region}` },
      { name: "Sunset Café", type: "Multi-cuisine", rating: 4.3, distance: "0.9 km", description: "Scenic café perfect for sundown drinks and beach-side snacks.", mapsQuery: `cafe+${region}` },
    ],
    famousPlaces: [
      { name: "Coastal Heritage Walk", type: "Cultural", rating: 4.3, distance: "1.0 km", description: "Explore the rich coastal heritage, fishing villages, and local culture.", mapsQuery: `heritage+${region}` },
      { name: "Lighthouse View Point", type: "Landmark", rating: 4.4, distance: "1.5 km", description: "Panoramic coastal views from an old lighthouse.", mapsQuery: `lighthouse+${region}` },
      { name: "Nature Trail", type: "Eco / Nature", rating: 4.2, distance: "2 km", description: "Scenic trail through coastal forests and mangrove patches.", mapsQuery: `nature+trail+${region}` },
    ],
  };
}

// ─── Unsplash Hero Images by State ────────────────────────────────────────

const STATE_IMAGES: Record<string, string[]> = {
  "Maharashtra": [
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&q=80",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
  ],
  "Tamil Nadu": [
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
    "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=900&q=80",
  ],
  "Kerala": [
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80",
    "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
  ],
  "Andhra Pradesh": [
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80",
  ],
  "Karnataka": [
    "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
    "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=900&q=80",
  ],
  "Gujarat": [
    "https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
    "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=900&q=80",
  ],
  "Goa": [
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80",
    "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
  ],
  "West Bengal": [
    "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80",
  ],
  "Odisha": [
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
    "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=900&q=80",
  ],
  "Puducherry": [
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
    "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=900&q=80",
  ],
  "Andaman and Nicobar Islands": [
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80",
    "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=900&q=80",
  ],
  "Lakshadweep": [
    "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=900&q=80",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
  ],
};

function getHeroImage(state: string, idx: number): string {
  const imgs = STATE_IMAGES[state] ?? ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80"];
  return imgs[idx % imgs.length];
}

// ─── Raw beach list (all 130+ beaches from beaches_india.py) ───────────────

interface RawBeach { id: string; name: string; state: string; region: string; lat: number; lon: number; description: string; tags: string[]; best_season: string; }

const RAW: RawBeach[] = [
  // MAHARASHTRA
  { id:"mh_001", name:"Juhu Beach", state:"Maharashtra", region:"Mumbai", lat:19.0948, lon:72.8265, description:"Mumbai's most iconic beach — a vibrant urban escape dotted with street food stalls, chaat vendors, and celebrity bungalows. Popular at sunrise and sunset.", tags:["urban","street_food","family","sunset"], best_season:"Oct–Mar" },
  { id:"mh_002", name:"Chowpatty Beach", state:"Maharashtra", region:"Mumbai", lat:18.9548, lon:72.8192, description:"Marine Drive's famous Chowpatty is Mumbai's cultural heartbeat — host to Ganesh Chaturthi immersions, bhelpuri stalls, and evening crowds against the Queen's Necklace lights.", tags:["urban","cultural","street_food","festival"], best_season:"Oct–Mar" },
  { id:"mh_003", name:"Gorai Beach", state:"Maharashtra", region:"Mumbai", lat:19.2104, lon:72.7887, description:"A peaceful escape from Mumbai's chaos, accessible by ferry. Known for its clean sands, Global Vipassana Pagoda nearby, and watersports activities.", tags:["family","ferry","watersports","peaceful"], best_season:"Oct–Mar" },
  { id:"mh_004", name:"Madh Island Beach", state:"Maharashtra", region:"Mumbai", lat:19.1540, lon:72.7950, description:"A secluded Bollywood favourite accessible by a short ferry ride. Less crowded than Juhu with a charming fishing village atmosphere and seafood shacks.", tags:["secluded","fishing","seafood","bollywood"], best_season:"Oct–Mar" },
  { id:"mh_005", name:"Aksa Beach", state:"Maharashtra", region:"Mumbai", lat:19.1751, lon:72.7980, description:"One of Mumbai's cleanest beaches, popular with locals for weekend picnics. Has a peaceful stretch with views of the Arabian Sea and nearby Manori Creek.", tags:["clean","picnic","family","peaceful"], best_season:"Oct–Mar" },
  { id:"mh_006", name:"Versova Beach", state:"Maharashtra", region:"Mumbai", lat:19.1280, lon:72.8130, description:"Famous for the world's largest beach cleanup drive led by locals. A working fishing village beach with freshly landed catch sold every morning.", tags:["fishing","cleanup","urban","sunrise"], best_season:"Oct–Mar" },
  { id:"mh_007", name:"Alibaug Beach", state:"Maharashtra", region:"Raigad", lat:18.6435, lon:72.8729, description:"Maharashtra's most popular weekend getaway from Mumbai. Features the historic Kolaba Fort rising from the sea and pristine black sand near the shore.", tags:["heritage","fort","weekend_getaway","family"], best_season:"Oct–Mar" },
  { id:"mh_008", name:"Nagaon Beach", state:"Maharashtra", region:"Raigad", lat:18.5425, lon:72.8958, description:"A serene beach near Alibaug popular with watersport enthusiasts. Relatively less crowded with clear waters and good facilities.", tags:["watersports","serene","family"], best_season:"Oct–Mar" },
  { id:"mh_009", name:"Kashid Beach", state:"Maharashtra", region:"Raigad", lat:18.4196, lon:72.8890, description:"Known as the 'Goa of Maharashtra' — pristine white sand beach with crystal blue water, casuarina groves, and minimal commercialization.", tags:["pristine","white_sand","swimming","nature"], best_season:"Oct–Mar" },
  { id:"mh_010", name:"Murud Beach", state:"Maharashtra", region:"Raigad", lat:18.3178, lon:73.0614, description:"A picturesque crescent-shaped beach near the iconic Janjira Fort — the only sea fort in India never conquered. A blend of history and natural beauty.", tags:["heritage","fort","crescent","history"], best_season:"Oct–Mar" },
  { id:"mh_011", name:"Tarkarli Beach", state:"Maharashtra", region:"Sindhudurg", lat:16.0172, lon:73.4726, description:"Maharashtra's best underwater experience — crystal-clear turquoise waters ideal for scuba diving, snorkelling, and glass-bottom boat rides. Near the Karli River backwaters.", tags:["scuba","snorkeling","backwaters","pristine"], best_season:"Oct–May" },
  { id:"mh_012", name:"Malvan Beach", state:"Maharashtra", region:"Sindhudurg", lat:16.0612, lon:73.4670, description:"Gateway to Sindhudurg Fort and Maharashtra's best diving spots. Famous for Malvani cuisine — sol kadhi, fish curry, and freshly caught seafood.", tags:["diving","heritage","seafood","fort"], best_season:"Oct–May" },
  { id:"mh_013", name:"Devbagh Beach", state:"Maharashtra", region:"Sindhudurg", lat:15.9968, lon:73.4875, description:"An isolated paradise at the confluence of the Karli River and Arabian Sea. Accessible only by boat, making it one of Maharashtra's most pristine beaches.", tags:["secluded","boat_access","pristine","nature"], best_season:"Oct–May" },
  { id:"mh_014", name:"Guhagar Beach", state:"Maharashtra", region:"Ratnagiri", lat:17.4998, lon:73.1969, description:"A pristine, low-footfall beach in Ratnagiri district with turtle nesting on its shores. Known for dense coconut groves and powdery white sand.", tags:["pristine","turtles","eco","nature"], best_season:"Oct–Apr" },
  { id:"mh_015", name:"Ganpatipule Beach", state:"Maharashtra", region:"Ratnagiri", lat:17.1437, lon:73.2760, description:"A sacred beach surrounding the self-emerged Ganpati temple right on the seashore. Clear waters and clean sand attract pilgrims and tourists alike.", tags:["pilgrimage","temple","clean","sacred"], best_season:"Oct–May" },
  { id:"mh_016", name:"Shrivardhan Beach", state:"Maharashtra", region:"Raigad", lat:18.0472, lon:73.0162, description:"A quiet, off-the-beaten-path beach known for its natural beauty, mango orchards, and the famous Shrivardhan-Harihareshwar circuit for road trippers.", tags:["peaceful","road_trip","nature","off_beat"], best_season:"Oct–Mar" },
  { id:"mh_017", name:"Harihareshwar Beach", state:"Maharashtra", region:"Raigad", lat:17.9987, lon:73.0046, description:"Called the 'Kashi of Maharashtra', this sacred beach is flanked by the Harihareshwar temple and basalt cliffs. The convergence of four hills makes it spiritually significant.", tags:["pilgrimage","sacred","cliffs","temple"], best_season:"Oct–Mar" },
  { id:"mh_018", name:"Dahanu Beach", state:"Maharashtra", region:"Palghar", lat:19.9686, lon:72.7124, description:"A calm, clean beach surrounded by chikoo orchards and strawberry farms. Popular for its laid-back vibe, good seafood, and Parsi cultural influence.", tags:["peaceful","family","seafood","off_beat"], best_season:"Oct–Mar" },
  { id:"mh_019", name:"Kelva Beach", state:"Maharashtra", region:"Palghar", lat:19.6150, lon:72.7066, description:"A long, clean stretch of beach with powdery sand near the Kelva Fort ruins. A favourite weekend escape for Mumbaikars seeking peace and quiet.", tags:["heritage","peaceful","clean","weekend_getaway"], best_season:"Oct–Mar" },
  // TAMIL NADU
  { id:"tn_001", name:"Marina Beach", state:"Tamil Nadu", region:"Chennai", lat:13.0500, lon:80.2824, description:"The world's second longest urban beach stretching 13km along Chennai's coast. A social and cultural hub with statues, lighthouses, and evening bazaars.", tags:["urban","longest","iconic","family","sunset"], best_season:"Nov–Feb" },
  { id:"tn_002", name:"Elliot's Beach", state:"Tamil Nadu", region:"Chennai", lat:13.0002, lon:80.2705, description:"Known as Besant Nagar Beach — Chennai's cleaner, quieter alternative to Marina. Popular with joggers, couples, and the vibrant café scene on its promenade.", tags:["urban","café","joggers","peaceful","evening"], best_season:"Nov–Feb" },
  { id:"tn_003", name:"Kovalam Beach", state:"Tamil Nadu", region:"Chennai", lat:12.7855, lon:80.2520, description:"Tamil Nadu's premier surf destination. Features consistent waves making it perfect for surfing lessons and competitions.", tags:["surfing","sport","waves","adventure"], best_season:"Oct–Jan" },
  { id:"tn_004", name:"Golden Beach", state:"Tamil Nadu", region:"Chennai", lat:12.9167, lon:80.2479, description:"A well-maintained beach near Uthandi with golden sands and good facilities. Popular for family outings and weekend getaways from Chennai.", tags:["family","clean","golden_sand","weekend"], best_season:"Nov–Feb" },
  { id:"tn_005", name:"Mahabalipuram Beach", state:"Tamil Nadu", region:"Kanchipuram", lat:12.6216, lon:80.1929, description:"A UNESCO World Heritage backdrop — the Shore Temple sits directly on these historic sands. A hub for stone carving workshops, diving, and cultural tourism.", tags:["heritage","UNESCO","temple","history","diving"], best_season:"Oct–Mar" },
  { id:"tn_006", name:"Kanyakumari Beach", state:"Tamil Nadu", region:"Kanyakumari", lat:8.0782, lon:77.5385, description:"The southernmost tip of India where the Bay of Bengal, Arabian Sea, and Indian Ocean converge. Witness the unique simultaneous sunrise and sunset on equinox days.", tags:["pilgrimage","tri_ocean","sunrise","sunset","iconic"], best_season:"Oct–Mar" },
  { id:"tn_007", name:"Rameshwaram Beach", state:"Tamil Nadu", region:"Ramanathapuram", lat:9.2889, lon:79.3091, description:"A sacred pilgrimage beach near the Ramanathaswamy Temple, one of India's 12 Jyotirlingas. Pilgrims take ritual dips at the 22 sacred wells.", tags:["pilgrimage","sacred","temple","Jyotirlinga"], best_season:"Oct–Mar" },
  { id:"tn_008", name:"Dhanushkodi Beach", state:"Tamil Nadu", region:"Ramanathapuram", lat:9.1744, lon:79.4129, description:"A hauntingly beautiful ghost town beach at the tip of Pamban Island. The 1964 cyclone wiped out the town — ruins and the Indo-Sri Lanka maritime view remain.", tags:["ghost_town","history","scenic","off_beat","heritage"], best_season:"Oct–Mar" },
  { id:"tn_009", name:"Silver Beach", state:"Tamil Nadu", region:"Cuddalore", lat:11.7447, lon:79.7637, description:"Named for its shimmering silver sands, this clean beach near Cuddalore is a hidden gem offering calm waters and minimal tourist crowds.", tags:["clean","silver_sand","peaceful","off_beat"], best_season:"Oct–Feb" },
  { id:"tn_010", name:"Poompuhar Beach", state:"Tamil Nadu", region:"Nagapattinam", lat:11.0842, lon:79.8620, description:"An archaeologically rich shore — ancient Poompuhar was a major Chola port city. Features the Silappadikaram Heritage Park and a picturesque lighthouse.", tags:["heritage","history","archaeological","lighthouse"], best_season:"Oct–Feb" },
  { id:"tn_011", name:"Kanniyakumari Sangam Beach", state:"Tamil Nadu", region:"Kanyakumari", lat:8.0763, lon:77.5408, description:"The sacred confluence point where three seas meet. Known for the Vivekananda Rock Memorial and Thiruvalluvar Statue visible offshore.", tags:["pilgrimage","sacred","confluence","iconic","monument"], best_season:"Oct–Mar" },
  // KERALA
  { id:"kl_001", name:"Kovalam Beach", state:"Kerala", region:"Thiruvananthapuram", lat:8.4020, lon:76.9784, description:"Kerala's most famous beach resort — a crescent bay with three beaches: Lighthouse (safest for swimming), Hawa (more active), and Samudra (quieter). International tourist hub.", tags:["resort","swimming","lighthouse","international","ayurveda"], best_season:"Sep–Mar" },
  { id:"kl_002", name:"Varkala Beach", state:"Kerala", region:"Thiruvananthapuram", lat:8.7341, lon:76.7198, description:"Kerala's only cliff beach — dramatic laterite cliffs drop to the Papanasham sacred sea, believed to cleanse sins. The cliff promenade is lined with yoga shacks and cafes.", tags:["cliffs","yoga","sacred","backpacker","pilgrimage"], best_season:"Oct–Mar" },
  { id:"kl_003", name:"Marari Beach", state:"Kerala", region:"Alappuzha", lat:9.5836, lon:76.3049, description:"A secluded fishermen's village beach with coconut-palm fringed sands. One of India's finest eco-resort destinations with Ayurveda retreats.", tags:["eco","ayurveda","fishing","secluded","luxury"], best_season:"Sep–Mar" },
  { id:"kl_004", name:"Alappuzha Beach", state:"Kerala", region:"Alappuzha", lat:9.4981, lon:76.3388, description:"Alleppey's charming beach near the famous backwaters and Nehru Trophy Boat Race finish line. Features a 137-year-old pier and panoramic Arabian Sea sunsets.", tags:["backwaters","boat_race","pier","heritage","sunset"], best_season:"Oct–Mar" },
  { id:"kl_005", name:"Cherai Beach", state:"Kerala", region:"Ernakulam", lat:10.1378, lon:76.1754, description:"Known as the 'Queen of Beaches in Kerala' — a 15km strip where backwaters and the sea exist side by side. Spot Chinese fishing nets and Irrawaddy dolphins.", tags:["dolphins","backwaters","fishing_nets","pristine","swimming"], best_season:"Oct–Mar" },
  { id:"kl_006", name:"Fort Kochi Beach", state:"Kerala", region:"Ernakulam", lat:9.9674, lon:76.2433, description:"A culturally rich beach near the historic Fort Cochin with iconic Chinese fishing nets, colonial architecture, spice markets, and the famous Kochi Biennale.", tags:["heritage","colonial","fishing_nets","culture","art"], best_season:"Oct–Mar" },
  { id:"kl_007", name:"Kappad Beach", state:"Kerala", region:"Kozhikode", lat:11.4184, lon:75.8009, description:"The historic beach where Portuguese explorer Vasco da Gama landed in 1498. A monument marks this world-changing arrival. Calm, peaceful sands with historical significance.", tags:["heritage","history","historic_landing","peaceful"], best_season:"Oct–Mar" },
  { id:"kl_008", name:"Muzhappilangad Drive-in Beach", state:"Kerala", region:"Kannur", lat:11.6234, lon:75.5994, description:"India's only and Asia's largest drive-in beach — 4km of hard-packed sand where cars can drive right to the water's edge.", tags:["drive_in","unique","adventure","family","iconic"], best_season:"Oct–Mar" },
  { id:"kl_009", name:"Bekal Beach", state:"Kerala", region:"Kasargod", lat:12.3902, lon:75.0341, description:"A scenic beach next to Bekal Fort — Kerala's largest fort offering panoramic sea views. The beach featured in Mani Ratnam's 'Bombay' film.", tags:["heritage","fort","cinema","peaceful","scenic"], best_season:"Oct–Mar" },
  { id:"kl_010", name:"Shangumughom Beach", state:"Kerala", region:"Thiruvananthapuram", lat:8.5102, lon:76.9287, description:"The closest beach to Thiruvananthapuram airport. Home to a giant mermaid sculpture and a fish-shaped restaurant. A lively local hangout with watersport facilities.", tags:["urban","sculpture","family","watersports","sunset"], best_season:"Oct–Mar" },
  { id:"kl_011", name:"Kollam Beach", state:"Kerala", region:"Kollam", lat:8.8977, lon:76.5900, description:"A historic beach in Kerala's cashew capital — the starting point of the famous 8-hour Kollam–Alleppey backwater cruise. Features an 1860 lighthouse and fishing harbour.", tags:["backwaters","cruise","lighthouse","heritage","fishing"], best_season:"Sep–Mar" },
  { id:"kl_012", name:"Beypore Beach", state:"Kerala", region:"Kozhikode", lat:11.1765, lon:75.8047, description:"Famous for its 2,000-year-old shipbuilding tradition of 'Uru' (Arabian dhow) construction. Watch master craftsmen build massive wooden dhows without blueprints.", tags:["heritage","shipbuilding","dhow","cultural","history"], best_season:"Oct–Mar" },
  // ANDHRA PRADESH
  { id:"ap_001", name:"Rishikonda Beach", state:"Andhra Pradesh", region:"Visakhapatnam", lat:17.7764, lon:83.3810, description:"Vizag's Blue Flag certified beach — one of only few in India. Crystal-clear waters, golden sands, and a hilly backdrop make it AP's most picturesque beach destination.", tags:["blue_flag","pristine","swimming","scenic","hills"], best_season:"Oct–Mar" },
  { id:"ap_002", name:"RK Beach", state:"Andhra Pradesh", region:"Visakhapatnam", lat:17.7249, lon:83.3371, description:"Ramakrishna Beach is Visakhapatnam's social hub — featuring the INS Kurusura Submarine Museum, Kali Temple, and beach road lined with promenades and food stalls.", tags:["submarine_museum","urban","family","promenade","temple"], best_season:"Oct–Mar" },
  { id:"ap_003", name:"Yendada Beach", state:"Andhra Pradesh", region:"Visakhapatnam", lat:17.7534, lon:83.4049, description:"A relatively uncrowded beach between Rishikonda and Bheemunipatnam. Popular with young crowds for swimming and beach volleyball.", tags:["swimming","peaceful","uncrowded","volleyball"], best_season:"Oct–Mar" },
  { id:"ap_004", name:"Bheemunipatnam Beach", state:"Andhra Pradesh", region:"Visakhapatnam", lat:17.8917, lon:83.4565, description:"Bheemili — AP's oldest municipality with Dutch and British colonial heritage. Features a historic Dutch cemetery, old lighthouse, and a scenic river-meets-sea confluence.", tags:["heritage","colonial","Dutch","lighthouse","history"], best_season:"Oct–Mar" },
  { id:"ap_005", name:"Yarada Beach", state:"Andhra Pradesh", region:"Visakhapatnam", lat:17.6495, lon:83.2609, description:"Vizag's most secluded beach flanked by the Eastern Ghats on three sides. Accessible only by road through forest — a pristine escape with dolphins occasionally spotted offshore.", tags:["secluded","pristine","dolphins","nature","hills"], best_season:"Oct–Mar" },
  { id:"ap_006", name:"Kothapatnam Beach", state:"Andhra Pradesh", region:"Prakasam", lat:15.5289, lon:80.2872, description:"An important olive ridley turtle nesting site. Known for its wide sandy shore and the Kothapatnam Port area.", tags:["turtles","conservation","nesting","eco"], best_season:"Oct–Feb" },
  { id:"ap_007", name:"Chirala Beach", state:"Andhra Pradesh", region:"Prakasam", lat:15.8258, lon:80.3531, description:"A long, wide beach on the Bay of Bengal coast. A major fishing centre in AP with active fish markets at dawn.", tags:["fishing","market","off_beat","textile"], best_season:"Oct–Mar" },
  { id:"ap_008", name:"Mypadu Beach", state:"Andhra Pradesh", region:"Nellore", lat:14.8733, lon:80.0144, description:"A serene beach near Nellore known for flamingo watching during winter migration. The Nelapattu Bird Sanctuary is nearby.", tags:["flamingos","birdwatching","wildlife","serene","eco"], best_season:"Nov–Feb" },
  { id:"ap_009", name:"Bhavanapadu Beach", state:"Andhra Pradesh", region:"Srikakulam", lat:18.5309, lon:84.0756, description:"A pristine, undiscovered beach in Srikakulam district with dark sands and powerful waves. Near the Bhavanapadu fishing village with a lighthouse.", tags:["pristine","off_beat","lighthouse","fishing"], best_season:"Oct–Mar" },
  { id:"ap_010", name:"Nizampatnam Beach", state:"Andhra Pradesh", region:"Guntur", lat:15.9021, lon:80.6624, description:"A historically significant port town beach. Ancient trade routes passed through here. Features mangrove patches, bird life, and a quiet shoreline.", tags:["history","mangroves","birdwatching","off_beat"], best_season:"Oct–Mar" },
  // KARNATAKA
  { id:"ka_001", name:"Gokarna Main Beach", state:"Karnataka", region:"Uttara Kannada", lat:14.5492, lon:74.3225, description:"A sacred beach near the Mahabaleshwar temple — Gokarna is one of seven sacred Mukti sthalas of Shiva. Pilgrims take ritual dips here while backpackers relax on adjacent beaches.", tags:["pilgrimage","sacred","temple","backpacker"], best_season:"Oct–Mar" },
  { id:"ka_002", name:"Om Beach", state:"Karnataka", region:"Uttara Kannada", lat:14.5328, lon:74.3165, description:"Named for its natural Om (ॐ) shape when viewed from above. A favourite backpacker beach with huts, cafes, dolphin sighting boat trips, and magnificent sunsets.", tags:["backpacker","dolphins","scenic","sunset","Om_shaped"], best_season:"Oct–Mar" },
  { id:"ka_003", name:"Kudle Beach", state:"Karnataka", region:"Uttara Kannada", lat:14.5423, lon:74.3107, description:"A calm crescent bay with gentle waves — ideal for swimming and snorkelling. Lined with simple guesthouses and seafood shacks.", tags:["swimming","snorkeling","backpacker","tranquil","crescent"], best_season:"Oct–Mar" },
  { id:"ka_004", name:"Half Moon Beach", state:"Karnataka", region:"Uttara Kannada", lat:14.5178, lon:74.3057, description:"Accessible only by boat or a 20-minute cliff trek. A pristine half-moon shaped cove with no roads — complete isolation, camping, and bioluminescent waters at night.", tags:["secluded","boat_access","camping","bioluminescence","pristine"], best_season:"Oct–Mar" },
  { id:"ka_005", name:"Paradise Beach", state:"Karnataka", region:"Uttara Kannada", lat:14.5028, lon:74.2987, description:"Gokarna's most remote beach — accessible only by boat. No electricity or mobile signal. A true off-grid paradise with camping under stars.", tags:["secluded","boat_access","camping","off_grid","pristine"], best_season:"Oct–Mar" },
  { id:"ka_006", name:"Malpe Beach", state:"Karnataka", region:"Udupi", lat:13.3534, lon:74.7134, description:"Udupi's main beach and gateway to St. Mary's Island. Features a busy fishing harbour, water sports, and boat rides to the hexagonal basalt rock formations.", tags:["boat_rides","watersports","fishing","family"], best_season:"Oct–May" },
  { id:"ka_007", name:"St. Mary's Island Beach", state:"Karnataka", region:"Udupi", lat:13.3579, lon:74.6795, description:"A geological marvel — hexagonal basalt rock formations created 88 million years ago when India separated from Madagascar. A National Geological Monument.", tags:["geological","basalt","heritage","UNESCO_candidate","unique"], best_season:"Oct–May" },
  { id:"ka_008", name:"Kaup Beach", state:"Karnataka", region:"Udupi", lat:13.2167, lon:74.7469, description:"A scenic beach near the 150-year-old Kaup Lighthouse offering panoramic views. Rocky outcrops create natural tidal pools and picturesque sunset photography spots.", tags:["lighthouse","rocky","tidal_pools","sunset","photography"], best_season:"Oct–Mar" },
  { id:"ka_009", name:"Maravanthe Beach", state:"Karnataka", region:"Udupi", lat:13.7534, lon:74.6298, description:"One of India's most scenic roads — NH-66 runs between the sea on one side and the Souparnika River on the other for 8km. A photographer's paradise.", tags:["scenic","highway","photography","river_meets_sea","unique"], best_season:"Oct–May" },
  { id:"ka_010", name:"Panambur Beach", state:"Karnataka", region:"Mangalore", lat:12.9554, lon:74.8117, description:"Mangalore's Blue Flag beach and venue for the annual International Kite Festival. A well-maintained beach with sand art competitions, water sports, and a breezy food court.", tags:["blue_flag","kite_festival","watersports","family","events"], best_season:"Oct–Mar" },
  { id:"ka_011", name:"Tannirbhavi Beach", state:"Karnataka", region:"Mangalore", lat:12.9376, lon:74.8065, description:"An accessible beach near Mangalore reached by a short ferry crossing. Quieter than Panambur with natural dunes, casuarina groves, and peaceful sunset views.", tags:["ferry","dunes","peaceful","nature","sunset"], best_season:"Oct–Mar" },
  { id:"ka_012", name:"Someshwar Beach", state:"Karnataka", region:"Mangalore", lat:12.8756, lon:74.8294, description:"A rocky beach near Ullal with natural rock formations, sea caves, and the historic Someshwar Temple. A favourite for photography and exploring tidal pools.", tags:["rocky","sea_caves","temple","photography","tidal_pools"], best_season:"Oct–Mar" },
  { id:"ka_013", name:"Murudeshwar Beach", state:"Karnataka", region:"Uttara Kannada", lat:14.0943, lon:74.4855, description:"Dominated by the world's second tallest Shiva statue (123 feet) on a rocky headland. The beach and the 20-storey Raja Gopura tower make this a stunning pilgrim and tourist destination.", tags:["pilgrimage","Shiva_statue","iconic","heritage","scenic"], best_season:"Oct–May" },
  { id:"ka_014", name:"Karwar Beach", state:"Karnataka", region:"Uttara Kannada", lat:14.8117, lon:74.1301, description:"A serene beach at the mouth of the Kali River near the Goa border. Rabindranath Tagore wrote about Karwar's beauty in 1882. Features the INS Chapal war memorial ship.", tags:["heritage","peaceful","Tagore","naval_memorial","river"], best_season:"Oct–May" },
  { id:"ka_015", name:"Ullal Beach", state:"Karnataka", region:"Mangalore", lat:12.8068, lon:74.8599, description:"Famous as the site where Rani Abbakka — India's first woman freedom fighter — resisted Portuguese colonizers. A historic beach with fishing activity and good waves for surfing.", tags:["heritage","history","surfing","fishing","freedom_fighter"], best_season:"Oct–Mar" },
  // GUJARAT
  { id:"gj_001", name:"Shivrajpur Beach", state:"Gujarat", region:"Devbhoomi Dwarka", lat:22.4889, lon:69.7223, description:"Gujarat's only Blue Flag beach and best snorkelling destination. Crystal-clear turquoise waters with colourful coral and marine life. Accessible from Dwarka.", tags:["blue_flag","snorkeling","coral","pristine","diving"], best_season:"Oct–Mar" },
  { id:"gj_002", name:"Mandvi Beach", state:"Gujarat", region:"Kutch", lat:22.8278, lon:69.3592, description:"A stunning beach near historic Mandvi with windmills, dhow shipyard, and the Vijay Vilas Palace of the erstwhile Kutch rulers. Active camel rides and local crafts.", tags:["heritage","palace","windmills","dhow","camel_rides"], best_season:"Oct–Mar" },
  { id:"gj_003", name:"Dwarka Beach", state:"Gujarat", region:"Devbhoomi Dwarka", lat:22.2372, lon:68.9685, description:"One of the four sacred Char Dham pilgrimages. Dwarka — the ancient kingdom of Lord Krishna — sits on this western tip. The Dwarkadhish Temple overlooks the sea.", tags:["pilgrimage","Char_Dham","Krishna","temple","sacred"], best_season:"Oct–Mar" },
  { id:"gj_004", name:"Okha Madhi Beach", state:"Gujarat", region:"Devbhoomi Dwarka", lat:22.4658, lon:69.0730, description:"An isolated beach near the Okha fishing port with views of Beyt Dwarka island. A serene, rarely visited stretch popular with birdwatchers.", tags:["off_beat","birdwatching","peaceful","fishing","island_views"], best_season:"Oct–Mar" },
  { id:"gj_005", name:"Tithal Beach", state:"Gujarat", region:"Valsad", lat:20.4960, lon:72.9337, description:"Gujarat's most popular beach among locals — known for its unique dark volcanic sand. Features an amusement park, temples, and a resort strip near Valsad.", tags:["dark_sand","family","local_favourite","amusement","temple"], best_season:"Oct–Mar" },
  { id:"gj_006", name:"Gopnath Beach", state:"Gujarat", region:"Bhavnagar", lat:21.4015, lon:71.6234, description:"A remote, pristine beach near the Gopnath Mahadev temple. Seasonal whale sharks are spotted offshore between November and January.", tags:["whale_sharks","eco","temple","pristine","wildlife"], best_season:"Nov–Jan" },
  { id:"gj_007", name:"Dumas Beach", state:"Gujarat", region:"Surat", lat:21.0876, lon:72.7117, description:"Surat's famous black sand beach with a spooky reputation — local legends of paranormal activity make it uniquely attractive to thrill-seekers alongside picnicking families.", tags:["black_sand","haunted","family","urban","legend"], best_season:"Oct–Mar" },
  { id:"gj_008", name:"Suvali Beach", state:"Gujarat", region:"Surat", lat:21.1456, lon:72.7867, description:"A long, clean black sand beach near Surat and Hazira Port. Less crowded than Dumas, featuring a river-meets-sea point at the Tapi estuary.", tags:["black_sand","peaceful","estuary","off_beat"], best_season:"Oct–Mar" },
  { id:"gj_009", name:"Naliya Beach", state:"Gujarat", region:"Kutch", lat:23.2614, lon:68.8314, description:"A remote beach near Lakhpat in Kutch with flamingo sightings, minimal tourism, and proximity to the India-Pakistan border.", tags:["flamingos","remote","off_beat","wildlife","border"], best_season:"Nov–Feb" },
  { id:"gj_010", name:"Jampore Beach", state:"Gujarat", region:"Daman", lat:20.4087, lon:72.8376, description:"A clean, lively beach in the Union Territory of Daman with water sports, beach shacks, and a relatively cooler vibe given Daman's permissive liquor laws.", tags:["watersports","family","lively","UT"], best_season:"Oct–Mar" },
  { id:"gj_011", name:"Devka Beach", state:"Gujarat", region:"Daman", lat:20.4228, lon:72.8392, description:"Daman's most popular beach with amusement rides, decorated with statues of the Panchajanya conch and a small amusement area. Crowded on weekends.", tags:["amusement","family","popular","UT"], best_season:"Oct–Mar" },
  // GOA
  { id:"ga_001", name:"Baga Beach", state:"Goa", region:"North Goa", lat:15.5523, lon:73.7517, description:"Goa's most energetic beach — famous for Tito's and Club Cubana nightlife, watersports, beach shacks, and the legendary Saturday Night Market at Arpora nearby.", tags:["nightlife","party","watersports","market","shacks"], best_season:"Nov–Mar" },
  { id:"ga_002", name:"Calangute Beach", state:"Goa", region:"North Goa", lat:15.5436, lon:73.7618, description:"Called the 'Queen of Beaches in Goa' — the longest and widest North Goa beach. A buzzing hub with parasailing, jet skiing, beach volleyball, and endless café options.", tags:["queen_of_beaches","watersports","family","shopping","lively"], best_season:"Nov–Mar" },
  { id:"ga_003", name:"Anjuna Beach", state:"Goa", region:"North Goa", lat:15.5741, lon:73.7428, description:"Goa's original hippie beach — home to the famous Wednesday Flea Market, psychedelic trance parties, and cliff-top sunset sessions.", tags:["flea_market","hippie","trance","nightlife","rocky"], best_season:"Nov–Mar" },
  { id:"ga_004", name:"Vagator Beach", state:"Goa", region:"North Goa", lat:15.6018, lon:73.7374, description:"A dramatic beach beneath Chapora Fort's red laterite cliffs. Two distinct coves — Big and Little Vagator. Known for underground music festivals.", tags:["fort","cliffs","music","Dil_Chahta_Hai","dramatic"], best_season:"Nov–Mar" },
  { id:"ga_005", name:"Arambol Beach", state:"Goa", region:"North Goa", lat:15.6847, lon:73.7044, description:"Goa's most bohemian beach — renowned for impromptu drum circles, yoga retreats, fire performances, a sweet freshwater lake, and a laid-back international community.", tags:["bohemian","yoga","drum_circle","fire_show","lake"], best_season:"Nov–Mar" },
  { id:"ga_006", name:"Candolim Beach", state:"Goa", region:"North Goa", lat:15.5147, lon:73.7654, description:"A quieter, family-friendly alternative to Calangute. A long, wide beach with comfortable beach shacks, water sports, and a mix of Indian and international tourists.", tags:["family","calm","watersports","shacks","mixed"], best_season:"Nov–Mar" },
  { id:"ga_007", name:"Morjim Beach", state:"Goa", region:"North Goa", lat:15.6380, lon:73.7257, description:"Goa's turtle beach — an olive ridley sea turtle nesting site protected by the Forest Department. Russian tourist favourite with a relaxed vibe.", tags:["turtles","eco","conservation","Russian","seafood"], best_season:"Oct–Mar" },
  { id:"ga_008", name:"Ashwem Beach", state:"Goa", region:"North Goa", lat:15.6611, lon:73.7158, description:"Goa's luxury kitesurf destination with boutique beach clubs, yoga centres, and the freshwater Mandrem River meeting the sea.", tags:["kitesurfing","luxury","yoga","boutique","peaceful"], best_season:"Nov–Mar" },
  { id:"ga_009", name:"Sinquerim Beach", state:"Goa", region:"North Goa", lat:15.5016, lon:73.7741, description:"A beautiful beach at the base of the 17th-century Fort Aguada. The fort's lighthouse is the oldest in Asia (1612). Home to Goa's top heritage hotels.", tags:["fort","lighthouse","heritage","luxury","history"], best_season:"Nov–Mar" },
  { id:"ga_010", name:"Chapora Beach", state:"Goa", region:"North Goa", lat:15.6044, lon:73.7358, description:"A quiet beach near the Chapora fishing village and fort. The relaxed atmosphere and view of Chapora Fort attract backpackers and photographers.", tags:["fishing","backpacker","fort","photography","quiet"], best_season:"Nov–Mar" },
  { id:"ga_011", name:"Palolem Beach", state:"Goa", region:"South Goa", lat:15.0098, lon:74.0228, description:"South Goa's most photogenic crescent bay with calm, shallow, crystal-clear waters — perfect for families. Famous for 'silent disco' parties and dolphin kayaking trips.", tags:["crescent","family","calm","dolphins","kayaking","silent_disco"], best_season:"Nov–Apr" },
  { id:"ga_012", name:"Colva Beach", state:"Goa", region:"South Goa", lat:15.2789, lon:73.9254, description:"South Goa's longest beach at 25km. A laid-back alternative to Calangute with the famous Our Lady of Mercy Church, shacks, and a gentle family-friendly vibe.", tags:["longest","family","church","heritage","laid_back"], best_season:"Nov–Mar" },
  { id:"ga_013", name:"Benaulim Beach", state:"Goa", region:"South Goa", lat:15.2471, lon:73.9274, description:"A quiet, traditional fishing village beach popular with European long-stay tourists. Excellent seafood, fewer crowds than North Goa, and beautiful sunsets.", tags:["fishing","quiet","European","seafood","sunset"], best_season:"Nov–Mar" },
  { id:"ga_014", name:"Agonda Beach", state:"Goa", region:"South Goa", lat:15.0479, lon:73.9929, description:"Consistently voted among India's best beaches — pristine, clean, and development-restricted. Olive ridley turtles nest here. A yoga and wellness retreat hotspot.", tags:["pristine","turtles","yoga","wellness","clean"], best_season:"Oct–Apr" },
  { id:"ga_015", name:"Cavelossim Beach", state:"Goa", region:"South Goa", lat:15.1649, lon:73.9508, description:"South Goa's 5-star beach resort strip — home to the Leela, Holiday Inn, and Radisson properties. A wide, clean beach with the Sal River meeting the sea nearby.", tags:["luxury","5_star","resort","river_confluence","clean"], best_season:"Nov–Mar" },
  { id:"ga_016", name:"Varca Beach", state:"Goa", region:"South Goa", lat:15.2060, lon:73.9449, description:"One of Goa's cleanest and most pristine beaches — white sands and calm waters. Dolphins are frequently spotted offshore.", tags:["pristine","dolphins","white_sand","clean","quiet"], best_season:"Nov–Mar" },
  { id:"ga_017", name:"Majorda Beach", state:"Goa", region:"South Goa", lat:15.2930, lon:73.9236, description:"A wide, peaceful beach between Colva and Benaulim. Less touristy but with all necessary amenities. Famous for its spectacular New Year's Eve beach parties.", tags:["peaceful","New_Year","wide","local","family"], best_season:"Nov–Mar" },
  { id:"ga_018", name:"Betalbatim Beach", state:"Goa", region:"South Goa", lat:15.2700, lon:73.9340, description:"A quiet beach popular among locals and birdwatchers — located near the Zuari River estuary, offering wetland views and wader bird sightings at low tide.", tags:["birdwatching","quiet","estuary","local","nature"], best_season:"Nov–Mar" },
  { id:"ga_019", name:"Bogmalo Beach", state:"Goa", region:"South Goa", lat:15.3830, lon:73.8320, description:"A small, charming cove beach near Goa airport. Good scuba diving site with Goa Diving School based here. Protected from strong waves by a natural headland.", tags:["scuba","diving","cove","small","protected"], best_season:"Nov–Apr" },
  { id:"ga_020", name:"Cabo de Rama Beach", state:"Goa", region:"South Goa", lat:14.9258, lon:74.0516, description:"A wild, undeveloped beach beneath the ruins of Cabo de Rama Fort — the oldest fort in Goa. Raw natural beauty with zero tourist infrastructure.", tags:["fort","wild","heritage","off_beat","ruins"], best_season:"Nov–Mar" },
  // WEST BENGAL
  { id:"wb_001", name:"Digha Beach", state:"West Bengal", region:"East Midnapore", lat:21.6284, lon:87.5067, description:"The 'Brighton of the East' — West Bengal's most popular beach resort. Hard-packed flat sands, gentle Bay of Bengal waves, and a long promenade make it perfect for families.", tags:["popular","family","promenade","urban","weekend"], best_season:"Oct–Mar" },
  { id:"wb_002", name:"Mandarmani Beach", state:"West Bengal", region:"East Midnapore", lat:21.6648, lon:87.6238, description:"India's longest motorable beach at 13km of packed red crab-dotted sand. Drive vehicles right to the water's edge. Quieter than Digha with better resort options.", tags:["motorable","crabs","long","resort","drive_in"], best_season:"Oct–Mar" },
  { id:"wb_003", name:"Shankarpur Beach", state:"West Bengal", region:"East Midnapore", lat:21.6584, lon:87.5867, description:"A fishing village beach between Digha and Mandarmani. Watch fishing trawlers unload fresh catch at dawn. A tranquil, authentic coastal Bengal experience.", tags:["fishing","authentic","peaceful","off_beat"], best_season:"Oct–Mar" },
  { id:"wb_004", name:"Tajpur Beach", state:"West Bengal", region:"East Midnapore", lat:21.6912, lon:87.6692, description:"An emerging eco-tourism destination with olive ridley turtle nesting programs. Deserted beaches, cashew orchards, and minimal tourist facilities make it pristine.", tags:["eco","turtles","pristine","cashew","emerging"], best_season:"Oct–Mar" },
  { id:"wb_005", name:"Bakkhali Beach", state:"West Bengal", region:"South 24 Parganas", lat:21.5702, lon:88.2286, description:"Gateway to the Sundarbans — a wide, deserted beach near the mangrove delta. Irrawaddy dolphins and Hoolock gibbons sighted nearby. Eco-tourism base for Sundarbans trips.", tags:["Sundarbans","dolphins","mangroves","eco","wildlife"], best_season:"Oct–Mar" },
  { id:"wb_006", name:"Sagar Island Beach", state:"West Bengal", region:"South 24 Parganas", lat:21.6497, lon:88.0625, description:"Where the Ganga meets the Bay of Bengal — Gangasagar (Sagar Island). The Makar Sankranti Mela draws millions of pilgrims for ritual dips at this sacred confluence.", tags:["pilgrimage","sacred","Ganga","confluence","Makar_Sankranti"], best_season:"Oct–Mar" },
  { id:"wb_007", name:"Junput Beach", state:"West Bengal", region:"East Midnapore", lat:21.7156, lon:87.8224, description:"A secluded, off-beat beach accessible by a ferry across the Rasulpur River. Famous for crabs, shrimps, and a quiet ambience away from Digha's crowds.", tags:["ferry","off_beat","crabs","peaceful","secluded"], best_season:"Oct–Mar" },
  { id:"wb_008", name:"Henry's Island Beach", state:"West Bengal", region:"South 24 Parganas", lat:21.7003, lon:88.1989, description:"A mangrove-fringed island beach near Bakkhali accessible by boat. Forest Department cottages available inside the mangrove reserve. Spot spotted deer on the beach.", tags:["mangroves","wildlife","deer","eco","island"], best_season:"Oct–Mar" },
  // ODISHA
  { id:"od_001", name:"Puri Beach", state:"Odisha", region:"Puri", lat:19.8005, lon:85.8317, description:"Odisha's most famous beach — a sacred town where the Jagannath Temple overlooks the sea. Site of the massive Rath Yatra chariot festival. Long golden sands with sea turtle nesting.", tags:["pilgrimage","Jagannath","Rath_Yatra","sacred","turtles"], best_season:"Oct–Mar" },
  { id:"od_002", name:"Chandrabhaga Beach", state:"Odisha", region:"Puri", lat:19.8872, lon:86.0944, description:"India's first Blue Flag certified beach. A pristine shore near the UNESCO Sun Temple at Konark. Hosts the annual International Sand Art Festival.", tags:["blue_flag","UNESCO","Sun_Temple","sand_art","pristine"], best_season:"Oct–Mar" },
  { id:"od_003", name:"Gopalpur Beach", state:"Odisha", region:"Ganjam", lat:19.2668, lon:84.9041, description:"A quiet, colonial-era beach resort town with a 19th-century lighthouse. Once a major British port — the old hotel and pier ruins add to its nostalgic charm.", tags:["colonial","lighthouse","heritage","peaceful","nostalgic"], best_season:"Oct–Feb" },
  { id:"od_004", name:"Chandipur Beach", state:"Odisha", region:"Balasore", lat:21.4560, lon:86.9820, description:"The 'Vanishing Sea Beach' — the tide recedes up to 5km exposing the seabed where visitors can walk out. Home to the DRDO missile test range.", tags:["vanishing_sea","unique","tidal","science","off_beat"], best_season:"Oct–Mar" },
  { id:"od_005", name:"Paradeep Beach", state:"Odisha", region:"Jagatsinghpur", lat:20.2889, lon:86.6993, description:"A beach near India's largest port. The confluence of the Mahanadi River and Bay of Bengal creates unique sand formations.", tags:["port","river_confluence","industrial","off_beat"], best_season:"Oct–Feb" },
  { id:"od_006", name:"Satapada Beach", state:"Odisha", region:"Puri", lat:19.6797, lon:85.5432, description:"A beach at the mouth of Chilika Lake — India's largest coastal lagoon. Irrawaddy dolphin spotting boat trips are the major attraction. Migratory birds flock in winter.", tags:["Chilika","dolphins","birdwatching","lagoon","eco"], best_season:"Nov–Feb" },
  { id:"od_007", name:"Talasari Beach", state:"Odisha", region:"Balasore", lat:21.5789, lon:87.1023, description:"A pristine, uncrowded beach on the Odisha-West Bengal border with casuarina forests, minimal tourism, and olive ridley turtle nesting.", tags:["pristine","turtles","uncrowded","casuarina","border"], best_season:"Oct–Mar" },
  // PUDUCHERRY
  { id:"py_001", name:"Promenade Beach", state:"Puducherry", region:"Puducherry", lat:11.9344, lon:79.8311, description:"Puducherry's iconic French colonial beach promenade — 1.5km of colourful Gallic architecture, war memorials, Gandhi statue, and the striking Aayi Mandapam.", tags:["colonial","French","promenade","heritage","iconic"], best_season:"Oct–Mar" },
  { id:"py_002", name:"Auroville Beach", state:"Puducherry", region:"Puducherry", lat:12.0072, lon:79.8640, description:"A surf destination near the experimental township of Auroville. Learn-to-surf schools operate here. The beach is near the famous Matrimandir golden sphere.", tags:["surfing","Auroville","spiritual","peaceful","surf_school"], best_season:"Oct–Mar" },
  { id:"py_003", name:"Paradise Beach", state:"Puducherry", region:"Puducherry", lat:11.9071, lon:79.8498, description:"Accessible only by a 10-minute boat ride across the Chunnambar River. A pristine, untouched beach with pure white sand and backwater picnic facilities.", tags:["boat_access","pristine","backwater","white_sand","secluded"], best_season:"Oct–Mar" },
  { id:"py_004", name:"Serenity Beach", state:"Puducherry", region:"Puducherry", lat:11.9682, lon:79.8491, description:"Puducherry's favourite surf spot with a laid-back vibe and consistent waves. Home to Kallialay Surf School — India's oldest surf school.", tags:["surfing","laid_back","waves","surf_school"], best_season:"Oct–Mar" },
  { id:"py_005", name:"Mahe Beach", state:"Puducherry", region:"Mahe", lat:11.7011, lon:75.5359, description:"A river-meets-sea beach in the Mahe enclave of Puducherry (within Kerala). A tranquil spot at the Mahe River mouth with a European colonial feel.", tags:["colonial","peaceful","river","off_beat"], best_season:"Oct–Mar" },
  { id:"py_006", name:"Yaram Beach", state:"Puducherry", region:"Karaikal", lat:10.9254, lon:79.8321, description:"A quiet, sandy beach in the Karaikal district of Puducherry. Known for its clean shores and proximity to the scenic Karaikal riverside.", tags:["quiet","clean","river","off_beat"], best_season:"Oct–Feb" },
  // ANDAMAN AND NICOBAR
  { id:"an_001", name:"Radhanagar Beach", state:"Andaman and Nicobar Islands", region:"Andaman", lat:11.9916, lon:92.9762, description:"Repeatedly voted Asia's best beach — pristine turquoise waters, powdery white sand, and lush jungle backdrop on Havelock Island. Sunset here is unmissable.", tags:["pristine","Asia_best","white_sand","jungle","sunset"], best_season:"Oct–May" },
  { id:"an_002", name:"Elephant Beach", state:"Andaman and Nicobar Islands", region:"Andaman", lat:12.0321, lon:92.9856, description:"Havelock's premier snorkelling spot — vibrant coral reefs, sea turtles, and clownfish in crystal clear shallow waters. Accessible by 30-min boat or jungle trek.", tags:["snorkeling","coral","turtles","boat_access","pristine"], best_season:"Oct–May" },
  { id:"an_003", name:"Kalapathar Beach", state:"Andaman and Nicobar Islands", region:"Andaman", lat:11.9741, lon:93.0029, description:"A dramatic beach on Havelock named for its distinctive black rocks (kala pathar). A quiet, scenic gem for sunrise walks and photography.", tags:["scenic","black_rocks","sunrise","photography","peaceful"], best_season:"Oct–May" },
  { id:"an_004", name:"Laxmanpur Beach", state:"Andaman and Nicobar Islands", region:"Andaman", lat:11.7598, lon:92.7219, description:"Neil Island's famous beach known for its spectacular sunset views over the natural coral arch. A serene, uncluttered strip of white sand.", tags:["sunset","coral_arch","pristine","Neil_Island","peaceful"], best_season:"Oct–May" },
  { id:"an_005", name:"Bharatpur Beach", state:"Andaman and Nicobar Islands", region:"Andaman", lat:11.7812, lon:92.7305, description:"Neil Island's most popular beach — shallow, calm glass-clear waters perfect for snorkelling and glass-bottom boat rides over colourful corals.", tags:["snorkeling","glass_bottom","calm","coral","family"], best_season:"Oct–May" },
  { id:"an_006", name:"Corbyn's Cove", state:"Andaman and Nicobar Islands", region:"Andaman", lat:11.6234, lon:92.7306, description:"Port Blair's closest beach — a palm-fringed crescent bay with calm waters and a naval war memorial. Best for an easy day trip from the capital.", tags:["Port_Blair","palm","memorial","calm","family"], best_season:"Oct–May" },
  { id:"an_007", name:"Wandoor Beach", state:"Andaman and Nicobar Islands", region:"Andaman", lat:11.5432, lon:92.5678, description:"Gateway to the Mahatma Gandhi Marine National Park — a protected biosphere with 15 islands, 50+ coral species, and rare marine mammals.", tags:["national_park","coral","biosphere","marine","protected"], best_season:"Oct–May" },
  // LAKSHADWEEP
  { id:"lk_001", name:"Bangaram Beach", state:"Lakshadweep", region:"Lakshadweep", lat:11.0021, lon:72.2753, description:"A pristine uninhabited atoll with crystal-clear lagoon waters — one of India's most exclusive beach destinations. World-class diving with rays, sharks, and turtles.", tags:["atoll","diving","exclusive","pristine","lagoon"], best_season:"Oct–May" },
  { id:"lk_002", name:"Minicoy Thundi Beach", state:"Lakshadweep", region:"Lakshadweep", lat:8.2831, lon:73.0472, description:"A stunning lagoon beach on Minicoy — Lakshadweep's southernmost island with a Maldivian cultural influence, tuna fishing tradition, and a 130-year-old lighthouse.", tags:["lagoon","Maldivian_culture","lighthouse","fishing","pristine"], best_season:"Oct–Apr" },
  { id:"lk_003", name:"Kadmat Beach", state:"Lakshadweep", region:"Lakshadweep", lat:11.2326, lon:72.7756, description:"Kadmat Island offers 8km of pristine beach flanked by turquoise lagoon on one side and deep ocean on the other — ideal for scuba diving and snorkelling.", tags:["diving","snorkeling","pristine","lagoon","8km"], best_season:"Oct–May" },
  { id:"lk_004", name:"Agatti Beach", state:"Lakshadweep", region:"Lakshadweep", lat:10.8536, lon:72.1920, description:"The entry point to Lakshadweep with a stunning coral reef lagoon. The only island with an airport. Known for windsurfing, snorkelling, and sea kayaking.", tags:["airport","lagoon","windsurfing","coral","kayaking"], best_season:"Oct–May" },
];

// ─── Build full BeachData array ─────────────────────────────────────────────

let _SEED = 42;
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const ALL_BEACHES: BeachData[] = RAW.map((b, idx) => {
  const s1 = seededRandom(_SEED + idx);
  const s2 = seededRandom(_SEED + idx + 1000);
  const score = Math.floor(55 + s1 * 40);
  const rating = parseFloat((3.9 + s2 * 1.0).toFixed(1));
  return {
    ...b,
    suitability_score: score,
    rating,
    heroImage: getHeroImage(b.state, idx),
    nearby: getNearby(b.state, b.region),
  };
});

// ─── Helper functions ────────────────────────────────────────────────────────

export function getAllBeaches(): BeachData[] {
  return ALL_BEACHES;
}

export function getBeachById(id: string): BeachData | undefined {
  return ALL_BEACHES.find(b => b.id === id);
}

export function getBeachesByState(state: string): BeachData[] {
  return ALL_BEACHES.filter(b => b.state === state);
}

export function getStates(): string[] {
  return [...new Set(ALL_BEACHES.map(b => b.state))];
}

export function getTopBeaches(n = 10): BeachData[] {
  return [...ALL_BEACHES].sort((a, b) => b.suitability_score - a.suitability_score).slice(0, n);
}
