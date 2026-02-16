class solution():

    
    def romanToInt(roman_string: str) -> int:
        """

        This function converts roman numbers to integers
    
        """
        roman_letters = {'I': 1, 'X': 10, 'V': 5, 'C': 100, 'L': 50, 'D': 500, 'M': 1000}
        if (len(roman_string) >= 1 and len(roman_string) <= 15):

            num = 0
            count = len(roman_string)

            for letter in roman_string:

                if letter not in roman_letters:
                    return -1
                
                
                if count >= 2 and roman_letters.get(letter) < roman_letters.get(roman_string[roman_string.find(letter) + 1]):
                    num -= roman_letters.get(letter)
                    count -= 2
                else:
                    num += roman_letters.get(letter)
                    count -= 1
        
            return num
        return -1
    
def main():
    RomanNum = input("Enter a roman number to convert: ")
    convertedNum = solution.romanToInt(RomanNum)
    if convertedNum == -1:
        print("Invalid input")
        main()
    else:
        print(convertedNum)

if __name__ == "__main__":
    main()

    