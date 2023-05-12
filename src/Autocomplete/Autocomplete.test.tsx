import { render, fireEvent, waitFor } from '@testing-library/react';
import Autocomplete from './Autocomplete';

/*
    These tests cover the following scenarios:

    - The component renders the input and label
    - The component allows the user to type and see suggestions
    - The component calls onSelect with the selected suggestion
*/

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
        const mockCharacter = { id: 1, name: 'Rick', "searchTermIndex": 0 };
        const mockResponse = { results: [mockCharacter] };
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });
        const { getByLabelText, getByRole, getByText } = render(
            <Autocomplete onSelect={mockOnSelect} />
        );

        const input = getByLabelText('Search for suggestions:');
        fireEvent.change(input, { target: { value: 'Rick' } });

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        expect(global.fetch).toHaveBeenCalledWith(
            'https://rickandmortyapi.com/api/character/?name=rick'
        );

        const suggestionsList = getByRole('listbox');
        expect(suggestionsList).toBeInTheDocument();
        expect(getByText('Rick')).toBeInTheDocument();
    });

    it('calls onSelect with the selected suggestion', async () => {
        const mockCharacter = { id: 1, name: 'Rick', "searchTermIndex": 0 };
        const mockResponse = { results: [mockCharacter] };
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });
        const { getByLabelText, getByText } = render(
            <Autocomplete onSelect={mockOnSelect} />
        );

        const input = getByLabelText('Search for suggestions:');
        fireEvent.change(input, { target: { value: 'Rick' } });
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        const suggestion = getByText('Rick');
        fireEvent.click(suggestion);

        expect(mockOnSelect).toHaveBeenCalledTimes(1);
        expect(mockOnSelect).toHaveBeenCalledWith(mockCharacter);
    });
});