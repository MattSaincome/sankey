#!/usr/bin/env python
"""
Helper script to get Berkshire wisdom from the command line.
This is designed to be called from the JavaScript API integration.
"""

import sys
import json
import argparse
from berkshire_knowledge import BerkshireKnowledge

def main():
    # Set up command line argument parsing
    parser = argparse.ArgumentParser(description='Get wisdom from Berkshire Hathaway letters')
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Command for enhancing a response with Buffett wisdom
    enhance_parser = subparsers.add_parser('enhance', help='Enhance a response with Buffett wisdom')
    enhance_parser.add_argument('query', help='User query to find relevant wisdom')
    enhance_parser.add_argument('response', help='Base response to enhance with wisdom')
    
    # Command for retrieving raw wisdom based on a query
    query_parser = subparsers.add_parser('query', help='Query for Buffett wisdom')
    query_parser.add_argument('query', help='Query to find relevant wisdom')
    query_parser.add_argument('--top-k', type=int, default=3, help='Number of results to return')
    query_parser.add_argument('--year', help='Filter by year (e.g., 2020)')
    
    # Command for retrieving investment principles
    principles_parser = subparsers.add_parser('principles', help='Get Buffett investment principles')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Initialize the knowledge system
    try:
        knowledge = BerkshireKnowledge()
        
        if args.command == 'enhance':
            # Generate enhanced response
            enhanced_response = knowledge.generate_response_with_berkshire_wisdom(args.query, args.response)
            print(enhanced_response)
            
        elif args.command == 'query':
            # Get raw wisdom results
            filters = {}
            if hasattr(args, 'year') and args.year:
                filters['year'] = args.year
                
            results = knowledge.query_berkshire_letters(args.query, top_k=args.top_k, filters=filters)
            print(json.dumps(results))
            
        elif args.command == 'principles':
            # Get investment principles
            principles = knowledge.get_investment_principles()
            print(json.dumps(principles))
            
        else:
            # If no command is specified, show usage
            parser.print_help()
            sys.exit(1)
            
    except Exception as e:
        # If any error occurs, return error in JSON format
        error_response = {
            'error': str(e),
            'success': False
        }
        print(json.dumps(error_response))
        sys.exit(1)

# For backward compatibility with the original interface
def legacy_main():
    # Check if arguments are provided
    if len(sys.argv) < 3:
        print("Usage: python get_wisdom.py \"user_query\" \"base_response\"")
        sys.exit(1)
    
    # Get the query and base response from arguments
    query = sys.argv[1]
    base_response = sys.argv[2]
    
    # Initialize the knowledge system
    try:
        knowledge = BerkshireKnowledge()
        
        # Generate enhanced response
        enhanced_response = knowledge.generate_response_with_berkshire_wisdom(query, base_response)
        
        # Output the enhanced response for the JavaScript code to capture
        print(enhanced_response)
        
    except Exception as e:
        # If any error occurs, return the original response
        print(f"Error enhancing response: {str(e)}")
        print(base_response)

if __name__ == "__main__":
    # Check if we're using the new command-line interface
    if len(sys.argv) > 1 and sys.argv[1] in ['enhance', 'query', 'principles']:
        main()
    else:
        # Fall back to the legacy interface for backward compatibility
        legacy_main()
