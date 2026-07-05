# Map Web Application

A modern **Map Web Application** built with **React**, **TypeScript**, **Redux Toolkit**, and **Mapbox GL JS**. The application allows users to add markers, draw polygons, manage map data, and import/export GeoJSON files through an intuitive and responsive interface.

---

## Features

### Markers

- **Add Markers** – Click anywhere on the map to place markers.
- **Coordinate Preview** – Hover over a marker to view its latitude and longitude coordinates.

### Polygon Drawing

- **Add Vertices** – Click on the map to add vertices and create a polygon.
- **Undo** – Remove the last added vertex.
- **Finish Polygon** – Complete the polygon after adding the required vertices. The application automatically calculates and displays the polygon's area in **m²** or **km²**.

### Sidebar

- View a list of all added **markers** and **polygons**.
- Remove individual markers or polygons directly from the sidebar.

### Clear All

- Remove all markers and polygons from the map, resetting it to its initial state.

### Save & Load

- **Save Data** – Save the current map data to **Local Storage**.
- **Load Data** – Restore the previously saved map data from **Local Storage**.

### GeoJSON Import & Export

- **Export GeoJSON** – Download all map data as a standard **GeoJSON FeatureCollection**.
- **Import GeoJSON** – Import `.geojson` or `.json` files. Supported **Point** and **Polygon** features are merged into the current map.

### Responsive Design

- Fully responsive and optimized for both **desktop** and **mobile** devices.

---

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure the Mapbox Access Token

Get a free access token from:
https://account.mapbox.com/access-tokens/

Create a `.env` file in the project root and add:

```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

---

## Customize the Initial Map Location

To change the default map center and zoom level, edit:

`src/features/map/utils/index.ts`

```ts
export const INITIAL_CENTER = [longitude, latitude];
export const INITIAL_ZOOM = 13.5;
```
