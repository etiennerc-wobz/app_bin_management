# MagicLoop LogisticsApp - FrontEnd

## Description

The application is a front-end interface developed in React.js for managing MagicBins and their Graals as part of the MagicLoop project. It allows users to manage the MagicBins, view associated data, and interact with the local server to update collection information.

## Project Structure

The project is structured as follows:

- **`public/`**: Contains static files such as the PNG images used in the application.
- **`src/`**: Contains the application's React source code.
    - **`App.js`**: The main component of the application.
    - **`api.js`**: Contains all the services. Handles communication with the server.
    - **`components/`**: Contains reusable components of the application.
    - **`pages/`**: Contains the main pages of the application.

## Prerequisites

Before starting, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14.x or higher recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Installation

1. Clone the project repository:

    ```bash
    git clone https://github.com/etiennerc-wobz/app_bin_management.git
    git checkout dev-greg
    cd bin-app/front
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

## Configuration

**The application communicates with a local server. Ensure that the server is running before starting the front-end application.**

## Usage

To start the application in development mode, run:

```bash
npm start
# or
yarn start
