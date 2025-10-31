import type { Food, SearchResult } from '../types';

const API_KEY = 'c2pWC2Om2MN4bbi9y5rIKgy5mvsNumqKIsevDsan';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export class USDAService {
  /**
   * Search for foods in the USDA database
   * @param query Search term
   * @param pageNumber Page number (1-indexed)
   * @param pageSize Number of results per page
   */
  static async searchFoods(
    query: string,
    pageNumber: number = 1,
    pageSize: number = 25
  ): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
        query,
        pageSize: pageSize.toString(),
        pageNumber: pageNumber.toString(),
        dataType: 'Foundation,SR Legacy,Survey (FNDDS),Branded',
      });

      const response = await fetch(`${BASE_URL}/foods/search?${params}`);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        foods: data.foods || [],
        totalHits: data.totalHits || 0,
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
      };
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific food by FDC ID
   * @param fdcId Food Data Central ID
   */
  static async getFoodById(fdcId: number): Promise<Food> {
    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
      });

      const response = await fetch(`${BASE_URL}/food/${fdcId}?${params}`);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching food details:', error);
      throw error;
    }
  }

  /**
   * Get multiple foods by their FDC IDs
   * @param fdcIds Array of Food Data Central IDs
   */
  static async getFoodsByIds(fdcIds: number[]): Promise<Food[]> {
    try {
      const response = await fetch(`${BASE_URL}/foods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fdcIds,
          api_key: API_KEY,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching foods by IDs:', error);
      throw error;
    }
  }
}
