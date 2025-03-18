import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError, delay, map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AiService {

  // private apiUrl = 'https://api.openai.com/v1/completions';
  // private apiKey = environment.openAIKey; // ✅ Get API key from environment
  // private categoryCache: Map<string, string> = new Map(); // ✅ Caching results

  constructor(private http: HttpClient) {}

  /** Categorize subscription using AI Function Calling */
  categorizeSubscription(serviceName: string) {
    const categories: { [key: string]: string } = {
      'Netflix': 'Streaming',
      'Hulu': 'Streaming',
      'Peacock': 'Streaming',
      'JioHotstar': 'Streaming',
      'Amazon Prime': 'Shopping',
      'Disney+': 'Entertainment',
      'Amazon Kindle': 'Book Reading',
      'Apple Music': 'Music',
      'Apple Podcasts': 'Music',
      'Spotify': 'Music',
      'Gym': 'Fitness',
      'Jio Cinema': 'Movies',
      'Cinemax': 'Movies',
      'TikTok': 'Social Media',
      'Instagram': 'Social Media',
      'Snapchat': 'Social Media',
      'Electricity': 'Utilities',
      'Wifi': 'Utilities',
      'Gas': 'Utilities',
      'Water': 'Utilities',
      'Electric Vehicle': 'Utilities',
      'Grammarly': 'Productivity',
      'ChatGPT': 'Productivity',
      'Udemy': 'Education',
      'Coursera': 'Education',
      'LeetCode': 'Education',
      'Codecademy': 'Education',
      'Google Services': 'Education',
      'Google Workspace': 'Education',
      'YouTube': 'Education',
      'Twitch': 'Education',
      'Anki': 'Education',
      'Trello': 'Project Management'
    };

    const category = categories[serviceName] || 'Other';
    return of(category);
  }
}
