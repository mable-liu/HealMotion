'use client';

import React, { useState } from 'react';
import './workout.css';
import injuries from '../data/injuries.json';

interface Exercise {
    name: string;
    reps: string;
    url?: string;
}

interface DayPlan {
    day: string;
    exercises: Exercise[];
}

export default function WorkoutPage() {
    const [injury, setInjury] = useState('');
    const [workoutPlan, setWorkoutPlan] = useState<DayPlan[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInjury(value);

        if (value) {
            const filteredSuggestions = injuries.filter((injury) =>
                injury.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInjury(suggestion);
        setSuggestions([]);
    };

    const handleSubmit = async () => {
        if (!injuries.includes(injury.toLowerCase())) {
            setWorkoutPlan([]);
            setError('Please enter a valid injury.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Send injury to the API - it will automatically retrieve the profile
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ injury }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                setError(data.error || 'Failed to generate workout plan');
                setWorkoutPlan([]);
            } else {
                setWorkoutPlan(data);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error fetching workout plan. Please make sure you have set up your profile first.');
            setWorkoutPlan([]);
        } finally {
            setIsLoading(false);
        }

        setSuggestions([]);
    };

    const toggleExerciseDetails = (day: string, index: number) => {
        setExpandedExercises((prev) => ({
            ...prev,
            [`${day}-${index}`]: !prev[`${day}-${index}`],
        }));
    };

    return (
        <div>
            <h1>Workout Assistant</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter your injury"
                    value={injury}
                    onChange={handleInputChange}
                    className="input-field"
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="suggestion-item"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button onClick={handleSubmit} className="submit-button">
                Submit
            </button>
            {isLoading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="workout-plan-container">
                {workoutPlan.length > 0 ? (
                    workoutPlan.map((dayPlan, index) => (
                        <div key={index} className="day-plan">
                            <h3>{dayPlan.day}</h3>
                            <ul>
                                {dayPlan.exercises.map((exercise, idx) => {
                                    const { name, reps, url } = exercise;
                                    const isExpanded = expandedExercises[`${dayPlan.day}-${idx}`];
                                    return (
                                        <li
                                            key={idx}
                                            onClick={() => toggleExerciseDetails(dayPlan.day, idx)}
                                            className={`exercise-item ${isExpanded ? 'expanded' : ''}`}
                                        >
                                            <strong>{name}</strong>
                                            {isExpanded && (
                                                <>
                                                    <p className="exercise-details">{reps}</p>
                                                    {url && (
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="exercise-link"
                                                        >
                                                            View Exercise
                                                        </a>
                                                    )}
                                                </>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))
                ) : (
                    !error && !isLoading && <p style={{ textAlign: 'center' }}>No workout plan available, please submit an injury.</p>
                )}
            </div>
        </div>
    );
}
