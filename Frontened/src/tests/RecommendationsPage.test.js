import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import RecommendationsPage from '../pages/RecommendationsPage'; // Adjust the path as needed

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe('RecommendationsPage', () => {
  beforeEach(() => {
    // Intercept GET requests to the recommendations endpoint and return dummy track data
    mock.onGet('http://localhost:5000/api/recommendations?emotion=happy').reply(200, {
      tracks: [
        {
          name: 'Song 1',
          artist: 'Artist 1',
          album: 'Album 1',
          image: 'https://example.com/image1.jpg',
          spotify_url: 'https://open.spotify.com/track/1',
        },
        {
          name: 'Song 2',
          artist: 'Artist 2',
          album: 'Album 2',
          image: 'https://example.com/image2.jpg',
          spotify_url: 'https://open.spotify.com/track/2',
        },
      ],
    });
  });

  afterEach(() => {
    // Reset the axios mock to clear any previous handlers
    mock.reset();
  });

  it('renders recommendations based on emotion', async () => {
    // Render the component
    render(<RecommendationsPage />);

    // Immediately, the component should display a loading message
    expect(screen.getByText(/Loading recommendations.../i)).toBeInTheDocument();

    // Wait for the component to update after the API call
    await waitFor(() => {
      expect(screen.getByText('Song 1')).toBeInTheDocument();
      expect(screen.getByText('Artist 1')).toBeInTheDocument();
      expect(screen.getByText('Song 2')).toBeInTheDocument();
      expect(screen.getByText('Artist 2')).toBeInTheDocument();
    });
  });
});
