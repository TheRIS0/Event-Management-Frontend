import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EventList from './components/EventList';
import Discussion from './components/Discussion';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/discussion/:eventId" element={<Discussion />} />
        </Routes>
    );
};

export default App;
