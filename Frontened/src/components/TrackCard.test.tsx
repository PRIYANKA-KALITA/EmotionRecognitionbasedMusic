import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TrackCard from "./TrackCard";
import "@testing-library/jest-dom";

describe("TrackCard Component - White Box Testing", () => {
  const mockTrack = {
    name: "Test Song",
    artist: "Test Artist",
    album: "Test Album",
    image: "test.jpg",
    spotify_url: "https://open.spotify.com/track/test",
  };

  const mockOnPlay = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("user_id", "123");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Mocked response" }),
      })
    ) as jest.Mock;

    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("ensureUserId returns false if user_id is not set", () => {
    localStorage.removeItem("user_id");
    const { getByText } = render(<TrackCard track={mockTrack} onPlay={mockOnPlay} />);
    expect(window.alert).toHaveBeenCalledWith("Please create a test user first!");
  });

  test("handleLike sends correct payload", async () => {
    const { getByText } = render(<TrackCard track={mockTrack} onPlay={mockOnPlay} />);
    const likeButton = getByText("Like");
    fireEvent.click(likeButton);

    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "123",
        track_name: "Test Song",
        artist: "Test Artist",
        spotify_url: "https://open.spotify.com/track/test",
      }),
    });
  });

  test("handleDislike sends correct payload", async () => {
    const { getByText } = render(<TrackCard track={mockTrack} onPlay={mockOnPlay} />);
    const dislikeButton = getByText("Dislike");
    fireEvent.click(dislikeButton);

    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/dislikes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "123",
        track_name: "Test Song",
        artist: "Test Artist",
        spotify_url: "https://open.spotify.com/track/test",
      }),
    });
  });

  test("handleSave sends correct payload", async () => {
    const { getByText } = render(<TrackCard track={mockTrack} onPlay={mockOnPlay} />);
    const saveButton = getByText("Save");
    fireEvent.click(saveButton);

    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/saves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "123",
        track_name: "Test Song",
        artist: "Test Artist",
        spotify_url: "https://open.spotify.com/track/test",
      }),
    });
  });

  test("handleAddFavorite sends correct payload", async () => {
    const { getByText } = render(<TrackCard track={mockTrack} onPlay={mockOnPlay} />);
    const favoriteButton = getByText("Favorite");
    fireEvent.click(favoriteButton);

    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "123",
        track_name: "Test Song",
        artist: "Test Artist",
        spotify_url: "https://open.spotify.com/track/test",
      }),
    });
  });

  test("onPlay callback is triggered with correct embed URL", () => {
    const { getByText } = render(<TrackCard track={mockTrack} onPlay={mockOnPlay} />);
    const playButton = getByText("Play");
    fireEvent.click(playButton);

    expect(mockOnPlay).toHaveBeenCalledWith(
      "https://open.spotify.com/embed/track/test"
    );
  });
});