#!/usr/bin/env python
"""
Bridge script for the Berkshire Hathaway knowledge system.
This script serves as the interface between the Node.js server and the Python-based knowledge system.
"""

import sys
import json
import argparse
from berkshire_knowledge import BerkshireKnowledge

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Buffett Wisdom Bridge')
    
    # Create mutually exclusive group for modes
    mode_group = parser.add_mutually_exclusive_group(required=True)
    mode_group.add_argument('--query', type=str, help='Search query')
    mode_group.add_argument('--principles', action='store_true', help='Get investment principles')
    
    # Optional arguments
    parser.add_argument('--top_k', type=int, default=3, help='Number of results to return')
    parser.add_argument('--year', type=int, help='Filter by specific year')
    parser.add_argument('--topic', type=str, help='Filter by topic')
    parser.add_argument('--years', type=str, help='Comma-separated list of years to filter by')
    
    return parser.parse_args()

def main():
    """Main entry point."""
    args = parse_arguments()
    
    # Initialize the knowledge system
    try:
        knowledge = BerkshireKnowledge()
    except Exception as e:
        error_message = {
            "found": False,
            "error": f"Failed to initialize BerkshireKnowledge: {str(e)}",
            "message": "Could not access Buffett wisdom at this time."
        }
        print(json.dumps(error_message))
        sys.exit(1)
    
    # Process query mode
    if args.query:
        # Prepare filters
        filters = {}
        if args.year:
            filters["year"] = args.year
        if args.topic:
            filters["topic"] = args.topic
        if args.years:
            try:
                years_list = [int(y.strip()) for y in args.years.split(',')]
                filters["years"] = years_list
            except ValueError:
                # Handle invalid years format
                pass
        
        # Get wisdom
        try:
            wisdom = knowledge.get_buffett_wisdom(args.query, top_k=args.top_k, filters=filters)
            print(json.dumps(wisdom))
        except Exception as e:
            error_message = {
                "found": False,
                "error": f"Error retrieving wisdom: {str(e)}",
                "message": "Error processing Buffett wisdom."
            }
            print(json.dumps(error_message))
            sys.exit(1)
    
    # Process principles mode
    elif args.principles:
        try:
            principles = knowledge.get_investment_principles()
            print(json.dumps(principles))
        except Exception as e:
            print(json.dumps([]))
            sys.exit(1)

if __name__ == "__main__":
    main()
