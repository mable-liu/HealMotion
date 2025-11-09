'use client';

import React, { useState } from 'react';
import './profile.css';

interface ProfileData {
    age: string;
    weight: string;
    height: string;
    sex: string;
    severity: string;
    fitnessGoals: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData>({
        age: '',
        weight: '',
        height: '',
        sex: '',
        severity: '',
        fitnessGoals: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // Filter out empty values and convert numeric fields
            const filteredProfile: Record<string, string | number> = {};

            Object.entries(profile).forEach(([key, value]) => {
                if (value !== '') {
                    // Convert age, weight, and height to numbers
                    if (key === 'age' || key === 'weight' || key === 'height') {
                        filteredProfile[key] = Number(value);
                    } else {
                        filteredProfile[key] = value;
                    }
                }
            });

            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filteredProfile),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || 'Profile updated successfully!');
            } else {
                alert(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('ERROR', error);
            alert('An error occurred while updating your profile. Please try again.');
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-header">Profile Page</h1>
            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={profile.age}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="weight">Weight (kg):</label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={profile.weight}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="height">Height (cm):</label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        value={profile.height}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Sex:</label>
                    <div className="checkbox-form-container">
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="male"
                                name="sex"
                                value="Male"
                                checked={profile.sex === "Male"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">Male</span>
                        </label>
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="female"
                                name="sex"
                                value="Female"
                                checked={profile.sex === "Female"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">Female</span>
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Severity:</label>
                    <div className="checkbox-form-container">
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="high"
                                name="severity"
                                value="High"
                                checked={profile.severity === "High"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">High</span>
                        </label>
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="medium"
                                name="severity"
                                value="Medium"
                                checked={profile.severity === "Medium"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">Medium</span>
                        </label>
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="low"
                                name="severity"
                                value="Low"
                                checked={profile.severity === "Low"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">Low</span>
                        </label>
                    </div>
                </div>
                <button className="submit-button" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}
