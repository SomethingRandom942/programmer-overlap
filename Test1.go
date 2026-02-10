package main

import (
	"bufio"
	"fmt"
	"math/big"
	"os"
	"strings"
	"time"
)

const (
	maxInputLength = 64     // max characters per input
	maxCount       = 531441 // 3^12
	maxBits        = 1024   // max bits for numerator/denominator
	maxRuntime     = 24 * time.Hour
)

func main() {
	startTime := time.Now()
	scanner := bufio.NewScanner(os.Stdin)

	// Enforce input length limit
	scanner.Buffer(make([]byte, maxInputLength), maxInputLength)

	sum := new(big.Rat)
	count := int64(0)
	running := true

	fmt.Println("Enter numbers one per line.")
	fmt.Println("Type 'q', 'quit', or 'exit' to finish.")

	for running {
		// Stop after 24 hours
		if time.Since(startTime) > maxRuntime {
			fmt.Println("\nMaximum runtime reached (24 hours).")
			break
		}

		fmt.Print("> ")

		if !scanner.Scan() {
			// EOF or input error
			break
		}

		input := strings.TrimSpace(scanner.Text())

		// Exit commands
		switch strings.ToLower(input) {
		case "q", "quit", "exit":
			running = false
			continue
		}

		// Reject scientific notation
		if strings.ContainsAny(input, "eE") {
			fmt.Println("Scientific notation is not allowed.")
			continue
		}

		// Parse number exactly
		value := new(big.Rat)
		if _, ok := value.SetString(input); !ok {
			fmt.Println("Invalid number format.")
			continue
		}

		// Prevent uncontrolled growth of sum
		sum.Add(sum, value)
		if sum.Num().BitLen() > maxBits || sum.Denom().BitLen() > maxBits {
			fmt.Println("Sum exceeds allowed numeric limits.")
			return
		}

		count++
		if count >= maxCount {
			fmt.Println("Maximum number of inputs reached.")
			break
		}
	}

	// Scanner error handling
	if err := scanner.Err(); err != nil {
		fmt.Println("Input error:", err)
		return
	}

	// Edge case: no valid numbers
	if count == 0 {
		fmt.Println("No valid numbers entered. Average cannot be calculated.")
		return
	}

	// Exact average calculation
	average := new(big.Rat).Quo(sum, big.NewRat(count, 1))

	fmt.Printf("Average of %d numbers: %s\n", count, average.RatString())
}
