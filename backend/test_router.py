from strategy_parser.parser import parse_chat_message

def test_parser():
    print("Testing Complete Prompt:")
    text1 = "If I invested 10k in Tata Motors buying every Monday and selling Friday"
    result1 = parse_chat_message(text1)
    print(f"Input: {text1}\nResult: {result1.model_dump_json(indent=2)}\n")

    print("Testing Incomplete Prompt (Missing Capital & Stock):")
    text2 = "what happens if I buy every tuesday and sell wednesday?"
    result2 = parse_chat_message(text2)
    print(f"Input: {text2}\nResult: {result2.model_dump_json(indent=2)}\n")
    
    print("Testing Incomplete Prompt (Missing sell day):")
    text3 = "test 5k in reliance buying on mondays"
    result3 = parse_chat_message(text3)
    print(f"Input: {text3}\nResult: {result3.model_dump_json(indent=2)}\n")

if __name__ == "__main__":
    test_parser()
