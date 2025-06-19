describe('UI Testing', () => {
  it('renders first scenario', () => {
    cy.visit('/index.html');
    
    cy.get('#scenario-container').should('contain', 'Seorang karyawan menemukan temannya');
    cy.get('#choices-container button').should('have.length', 2);
    cy.get('#next-btn').should('have.class', 'hidden');
  });
});