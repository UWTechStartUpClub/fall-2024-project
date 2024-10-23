

const SearchBar = () => {


    return (
        <div>
            <h1>Welcome to Stock Market Tracker</h1>
            <form id="stock-form" action="/stock/:symbol" method="GET">
                <input type="text" name="symbol" placeholder="Enter stock symbol" required />
                <button type="submit">Get Stock Data</button>
            </form>
            <div>

            </div>
        </div>
    )
}

export default SearchBar