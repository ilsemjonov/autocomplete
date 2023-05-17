/*
    These tests cover the following scenarios:

    - The component renders the input and label
    - The component allows the user to type and see suggestions
    - The component calls onSelect with the selected suggestion
*/

import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Autocomplete from './Autocomplete';

describe('Autocomplete', () => {
    const mockOnSelect = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the input and label', () => {
        const { getByLabelText } = render(<Autocomplete onSelect={mockOnSelect} />);
        expect(getByLabelText('Search for suggestions:')).toBeInTheDocument();
    });

    it('allows the user to type and see suggestions', async () => {
        const mockCharacter = { id: 1, name: 'Rick', searchTermIndex: 0 };
        const mockResponse = { results: [mockCharacter] };
        axios.get = jest.fn().mockResolvedValueOnce({ data: mockResponse });

        const { getByLabelText, getByRole, getByText } = render(
            <Autocomplete onSelect={mockOnSelect} />
        );

        const input = getByLabelText('Search for suggestions:');
        fireEvent.change(input, { target: { value: 'Rick' } });

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
        expect(axios.get).toHaveBeenCalledWith(
            'https://rickandmortyapi.com/api/character/?name=rick'
        );

        const suggestionsList = getByRole('listbox');
        expect(suggestionsList).toBeInTheDocument();
        expect(getByText('Rick')).toBeInTheDocument();
    });

    it('calls onSelect with the selected suggestion', async () => {
        const mockCharacter = { id: 1, name: 'Rick', searchTermIndex: 0 };
        const mockResponse = { results: [mockCharacter] };
        axios.get = jest.fn().mockResolvedValueOnce({ data: mockResponse });

        const { getByLabelText, getByText } = render(
            <Autocomplete onSelect={mockOnSelect} />
        );

        const input = getByLabelText('Search for suggestions:');
        fireEvent.change(input, { target: { value: 'Rick' } });
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        const suggestion = getByText('Rick');
        fireEvent.click(suggestion);

        expect(mockOnSelect).toHaveBeenCalledTimes(1);
        expect(mockOnSelect).toHaveBeenCalledWith(mockCharacter);
    });
});
