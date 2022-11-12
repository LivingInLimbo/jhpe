import { gql } from "@apollo/client";

export const GET_SINGLE_LISTING = gql`
  query getListing($id: Int) {
    getListing(id: $id) {
      id
      title
      description
      price
      category {
        name
      }
      subcategory {
        name
      }
      images {
        name
      }
      user {
        id
        email
        firstName
        lastName
        isGold
      }
    }
  }
`;

export const GET_USER_LISTING = gql`
  query getUserListing($id: Int) {
    getUserListing(id: $id) {
      id
      title
      description
      price
      category {
        name
      }
      subcategory {
        name
      }
      images {
        name
      }
      user {
        id
        email
        firstName
        lastName
        isGold
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query getCategories {
    categories {
      id
      urlName
      name
      subcategory {
        id
        urlName
        name
      }
    }
  }
`;
