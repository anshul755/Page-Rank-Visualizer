# 🚀 Quick Setup Guide

## Step 1: Install Tailwind CSS

Run these commands in your terminal (PowerShell):

```powershell
npm install -D tailwindcss postcss autoprefixer
```

## Step 2: Verify Backend is Running

Make sure your Spring Boot backend is running on `http://localhost:8080`

Test it by opening: http://localhost:8080/health-check

It should return "Ok"

## Step 3: Enable CORS on Backend

Add this to your Spring Boot application:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
```

## Step 4: Start the Frontend

```powershell
npm run dev
```

The app will open at: http://localhost:5173

## Step 5: Create Your First Graph

1. Click **"Add Node"** button
2. Click on canvas 3-4 times to create nodes (A, B, C, D)
3. Click **"Add Edge"** button
4. Click node A, then click node B (creates edge A→B)
5. Create more edges as desired
6. Click **"Calculate PageRank"**
7. Watch the magic! 🎉

## Troubleshooting

### CSS not loading?

- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Backend connection error?

- Check backend is running: http://localhost:8080/health-check
- Check CORS configuration in backend
- Check browser console (F12) for detailed errors

### Tailwind warnings in console?

- These are expected before installing Tailwind
- Run: `npm install -D tailwindcss postcss autoprefixer`
- Restart: `npm run dev`

## Features to Try

✅ Drag nodes to reposition them  
✅ Select a node to edit its label in the Properties Panel  
✅ Add edges by clicking source then target  
✅ Delete mode to remove nodes/edges  
✅ Adjust damping factor (0.5 - 1.0)  
✅ Adjust iterations (10 - 1000)  
✅ View calculation history  
✅ Load previous graphs

## Example Graph Scenarios

### Simple Chain

A → B → C → D

- Results: D gets highest rank

### Star Pattern

A → B, A → C, A → D, A → E

- Results: A distributes rank evenly

### Circular

A → B → C → D → A

- Results: All nodes get equal rank

### Authority Node

A → D, B → D, C → D

- Results: D gets very high rank (authority)

Enjoy! 🎨
