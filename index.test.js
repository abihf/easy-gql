const gql = require('graphql-tag');
const egql = require('./index');

describe('easy-gql', () => {
  it('should return same AST as vanilla graphql-tag', () => {
    const gqlQuery = gql`query Q1 { test }`;
    const egqlQuery = egql`query Q1 { test }`;
    expect(egqlQuery).toMatchObject(gqlQuery);
  });

  it('should handle simple fragment', () => {
    const gqlFragment = gql`fragment F1 on Type { field2 }`
    const gqlQuery = gql`query Q1 { test { ...F1 } } ${gqlFragment}`;
    delete gqlQuery.loc;

    const egqlFragment = egql`fragment F1 on Type { field2 }`
    const egqlQuery = egql`query Q1 { test { ...${gqlFragment} } }`;

    expect(egqlQuery).toMatchObject(gqlQuery);
  });

  it('should handle multiple fragment', () => {
    const fragment1 = egql`fragment F2 on ParentType { field1 }`
    const childFragment = egql`fragment FC on ChildType { childFragment }`
    const fragment2 = egql`fragment F3 on ParentType { field2 ...${childFragment} }`
    const query = egql`query Q1 { parent { ...${fragment1} ...${fragment2} }}`;

    expect(query).toMatchSnapshot();
  })

})
