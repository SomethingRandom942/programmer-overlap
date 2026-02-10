package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)

	var sum float64
	var count int

	fmt.Println("Enter numbers one per line.")
	fmt.Println("Type 'q', 'quit', or 'exit' to finish.")

	for {
		fmt.Print("> ")

		// Read input; false means EOF or input error
		if !scanner.Scan() {
			fmt.Println("\nEnd of input detected.")
			break
		}

		input := strings.TrimSpace(scanner.Text())

		// Exit conditions
		switch strings.ToLower(input) {
		case "q", "quit", "exit":
			goto DONE
		}

		// Attempt to parse number
		value, err := strconv.ParseFloat(input, 64)
		if err != nil {
			fmt.Println("Invalid input. Please enter a valid number.")
			continue
		}

		sum += value
		count++
	}

DONE:
	// Handle scanner error (rare but important)
	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading input:", err)
		return
	}

	// Edge case: no valid numbers entered
	if count == 0 {
		fmt.Println("No valid numbers entered. Average cannot be calculated.")
		return
	}

	average := sum / float64(count)
	fmt.Printf("Average of %d numbers: %.4f\n", count, average)
}
