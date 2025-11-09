'use client';

import React, { useState } from 'react';
import Modal from '../components/Modal';
import './diet.css';
import injuries from '../data/injuries.json';

interface Meal {
    meal: string;
    items: string[];
}

interface DayPlan {
    day: string;
    meals: Meal[];
}

export default function DietPage() {
    const [diet, setDiet] = useState<DayPlan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
    const [injury, setInjury] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

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

    const handleFetchDiet = async () => {
        if (!injury || !injuries.includes(injury.toLowerCase())) {
            setDiet([]);
            setError('Please enter a valid injury.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/diet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ injury }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                setError(data.error || 'Failed to generate diet plan');
                setDiet([]);
            } else {
                setError(null);
                setDiet(data);
            }
        } catch (err) {
            console.error('Error fetching diet:', err);
            setError('Failed to fetch diet recommendations. Please make sure you have set up your profile first.');
        } finally {
            setIsLoading(false);
        }

        setSuggestions([]);
    };

    const handleOpenModal = (day: DayPlan) => {
        setSelectedDay(day);
    };

    const handleCloseModal = () => {
        setSelectedDay(null);
    };

    return (
        <div>
            <h1>Nutrition</h1>
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
            <button className="submit-button" onClick={handleFetchDiet}>
                Get Diet
            </button>
            {isLoading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="diet-plan-container">
                {diet.length > 0 ? (
                    diet.map((day, index) => (
                        <div
                            key={index}
                            className="day-plan"
                            onClick={() => handleOpenModal(day)}
                        >
                            <h3>{day.day}</h3>
                        </div>
                    ))
                ) : (
                    !error && !isLoading && <p style={{ textAlign: 'center' }}>No diet plan available, please submit an injury.</p>
                )}
            </div>
            <Modal
                isOpen={!!selectedDay}
                onClose={handleCloseModal}
                dayPlan={selectedDay}
            />
        </div>
    );
}
