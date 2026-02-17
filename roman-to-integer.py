class solution():

    
    def romanToInt(s: str) -> int:
        """

        This function converts roman numbers to integers
    
        """
        roman_letters = {'I': 1, 'X': 10, 'V': 5, 'C': 100, 'L': 50, 'D': 500, 'M': 1000}
        
        if len(s) == 1:
            return roman_letters.get(s)
        
        if (len(s) > 1 and len(s) <= 15):

            num = 0
            count = len(s)

            for letter in s:

                if letter not in roman_letters:
                    return -1
            
                
                if ((count >= 2 or s[s.find(letter)] == s[-2]) and roman_letters.get(letter) < roman_letters.get(s[s.find(letter) + 1])):
                    num -= roman_letters.get(letter)
                    count -= 2
                    s = s[s.find(letter):]
                else:
                    num += roman_letters.get(letter)
                    count -= 1
                    s = s[s.find(letter):]
        
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

    