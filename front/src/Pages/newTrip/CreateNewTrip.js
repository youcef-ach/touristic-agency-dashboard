import { GoogleGenAI } from "@google/genai";
import { secureApi } from "../../api/api";
import { isLoggedIn } from "../../api/isLoggedIn";

const geminiKey = "AIzaSyBh6C3yoV_wTzm3NsWMUyAce8-mM768n54";
const unsplashKey = "pK_LOCuw9jK82txknOE9jwZfjlyUv8c5lv2f8KylzKo";

export const action = async (values) => {
  const { country, Duration, Gtype, Tstyle, budget, interests } = values;

  const ai = new GoogleGenAI({ apiKey: geminiKey });

  try {
    const prompt = `Generate a ${Duration}-day travel itinerary for ${country} based on the following user information:
    Budget: '${budget}'
    Interests: '${interests}'
    TravelStyle: '${Tstyle}'
    GroupType: '${Gtype}'
    Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
    {
    "name": "A descriptive title for the trip",
    "description": "A brief description of the trip and its highlights not exceeding 100 words",
    "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
    "duration": ${Duration},
    "budget": "${budget}",
    "travelStyle": "${Tstyle}",
    "country": "${country}",
    "interests": ${interests},
    "groupType": "${Gtype}",
    "bestTimeToVisit": [
      '🌸 Season (from month to month): reason to visit',
      '☀️ Season (from month to month): reason to visit',
      '🍁 Season (from month to month): reason to visit',
      '❄️ Season (from month to month): reason to visit'
    ],
    "weatherInfo": [
      '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
    ],
    "location": {
      "city": "name of the city or region",
      "coordinates": [latitude, longitude],
      "openStreetMap": "link to open street map"
    },
    "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
        {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
        {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
      ]
    },
    ...
    ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    let textAiResponse = response.text;

    textAiResponse = textAiResponse.replace(/```(json)?/g, "").trim();

    const parsed = JSON.parse(textAiResponse);

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${Tstyle}&client_id=${unsplashKey}`
    );

    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((item) => item.urls?.regular || null);

    const payload = {
      name: parsed.name,
      description: parsed.description,
      estimated_price: parsed.estimatedPrice,
      duration: parsed.duration,
      budget: parsed.budget,
      travel_style: parsed.travelStyle,
      country: parsed.country,
      interests: parsed.interests,
      group_type: parsed.groupType,
      best_time_to_visit: parsed.bestTimeToVisit,
      weather_info: parsed.weatherInfo,
      location: parsed.location,
      itinerary: parsed.itinerary,
      images: imageUrls.map((url) => ({ image_url: url })),
      user: isLoggedIn().id,
    };

    const djangoResponse = await secureApi.post("trips/create/", payload, {
      headers: { "Content-Type": "application/json" },
    });

    return djangoResponse;
  } catch (err) {
    throw err;
  }
};