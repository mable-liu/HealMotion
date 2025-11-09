'use client';

import React from 'react';
import './modal.css';

interface Meal {
    meal: string;
    items: string[];
}

interface DayPlan {
    day: string;
    meals: Meal[];
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayPlan: DayPlan | null;
}

export default function Modal({ isOpen, onClose, dayPlan }: ModalProps) {
    if (!isOpen || !dayPlan) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>{dayPlan.day}</h2>
                <ul>
                    {dayPlan.meals.map((meal, i) => (
                        <li key={i}>
                            <strong>{meal.meal}</strong>
                            <ul>
                                {meal.items.map((item, j) => (
                                    <li key={j}>{item}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
