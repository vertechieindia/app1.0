// Google Maps Places API Type Declarations
declare namespace google {
  namespace maps {
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (
            predictions: AutocompletePrediction[] | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
      }

      interface AutocompletionRequest {
        input: string;
        types?: string[];
        componentRestrictions?: ComponentRestrictions;
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        location?: LatLng;
        offset?: number;
        radius?: number;
        sessionToken?: AutocompleteSessionToken;
      }

      interface AutocompletePrediction {
        description: string;
        matched_substrings: PredictionSubstring[];
        place_id: string;
        reference: string;
        structured_formatting: StructuredFormatting;
        terms: PredictionTerm[];
        types: string[];
      }

      interface PredictionSubstring {
        length: number;
        offset: number;
      }

      interface StructuredFormatting {
        main_text: string;
        main_text_matched_substrings: PredictionSubstring[];
        secondary_text: string;
        secondary_text_matched_substrings?: PredictionSubstring[];
      }

      interface PredictionTerm {
        offset: number;
        value: string;
      }

      interface ComponentRestrictions {
        country: string | string[];
      }

      class AutocompleteSessionToken {}

      enum PlacesServiceStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR',
        NOT_FOUND = 'NOT_FOUND',
      }
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngBounds {
      contains(latLng: LatLng): boolean;
      extend(point: LatLng): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }
  }
}

interface Window {
  google?: typeof google;
}


