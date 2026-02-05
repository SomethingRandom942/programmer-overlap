package main

import (
	"fmt"
)

func main() {
	var sum int = 0
	var count int = 0
	for {
		var i int

		fmt.Print("Type a number: ")
		fmt.Scan(&i)
		sum += i
		count++
		var m string

		fmt.Print("Insert e to exit. Anything else to continue: ")
		fmt.Scan(&m)
		if m == "e" {
			break
		}

	}
	fmt.Print("The sum of your numbers is : ", sum/count)
}
