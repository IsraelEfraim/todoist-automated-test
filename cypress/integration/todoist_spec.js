import { url, cookies, user } from '../fixtures/defines.json'

/* App Logic */

const app = {
    login: (email, password) => {
        cy.visit(url)

        cy.get('.W9ktc > li').first().click()

        cy.get('#login_form').within(() => {
            cy.get('input[name=email]').type(`${email}`)
            cy.get('input[name=password]').type(`${password}`)
            cy.get('.submit_btn').click()
        })
    },

    addInboxTodo: (name) => {
        cy.get('.action_add_item').click({ force: true })
        cy.get('.DraftEditor-editorContainer').type(name).type('{enter}')
    },

    compareLength: (selector, callable, expected) => {
        cy.get(selector).its('length').then(length => {
            callable()
            cy.get(selector).should('have.length', expected(length))
        })
    },

    toggleCompleted: () => {
        cy.get('.list_editor').find('.view_header__actions > button.gear_icon').click()
        cy.get('.ist_menu:visible').find('td[data-track="project|action_show_completed"]:visible').click()
    },

    deleteInboxTodos: () => {
        // Once an element is removed, its children iterator
        // is invalidated, so it shouldn't be used.
        cy.get('.task_item_details').each(ignore => {
            cy.get('li[id^="item"]').first().find('.gear_menu').click()
            cy.get('.ist_menu:visible').find('.sel_delete_task').click()
            cy.get('footer.reactist_modal_box__actions > button[type=submit]').click()
        })
    },

    selectors: {
        items: '.items',
        todos: '.task_item_details'
    }
}

/* Tests */

context('Todoist automated tests', () => {
    describe('To perform login or not to perform', () => {
        it('should be logged in', () => {
            app.login(user.email, user.password)
            cy.url().should('include', '/app')

            cookies.forEach(cookie => {
                cy.getCookie(cookie).should('exist')
            })
        })

        it('should complain about mismatched email/password', () => {
            app.login(user.email, 'randompassword123')
            cy.get('.error_msg').should('exist')

            cookies.forEach(cookie => {
                cy.getCookie(cookie).should('not.exist')
            })
        })

        it('should complain about blank password', () => {
            app.login(user.email, '')
            cy.get('.error_msg').should('exist')

            cookies.forEach(cookie => {
                cy.getCookie(cookie).should('not.exist')
            })
        })

        it('should be able to logout', () => {
            app.login(user.email, user.password)

            cy.get('button[aria-controls=setting_menu]').click()
            cy.get('#setting_menu').find('.usermenu__row').last().click()

            cy.url().should('not.include', '/app')
        })
    })

    describe('Manage Inbox Todos', () => {
        before(() => {
            app.login(user.email, user.password)
        })

        beforeEach(() => {
            Cypress.Cookies.preserveOnce(...cookies)
        })

        const todos = [
            'Help Josué climb so he can get out of bronze in League',
            'Refactor Compiler Project\'s listeners classes',
            'Get this todo a new creative name'
        ]

        it('should be able to create a todo', () => {
            cy.get('#filter_inbox').click()
            cy.get(app.selectors.items).then(items => {
                const length = items.find(app.selectors.todos).length

                todos.forEach(todo => {
                    app.addInboxTodo(todo)
                    cy.contains(todo).first().should('exist')
                })

                cy.get(app.selectors.todos).should('have.length', length + todos.length)
            })
        })

        it('should not be able to create an empty todo', () => {
            cy.get(app.selectors.todos).its('length').then(length => {
                app.addInboxTodo('')

                cy.get(app.selectors.todos).should('have.length', length)
            })
        })

        it('should be able to complete a task', () => {
            cy.get(app.selectors.todos).first().find('.ist_checkbox').click({ force: true })
            app.toggleCompleted()

            cy.get(app.selectors.items).find('.moreItemsHint').should('exist')

            app.toggleCompleted()
        })

        it('should be able to delete a todo', () => {
            cy.get(app.selectors.todos).its('length').then(length => {
                cy.get('li[id^="item"]').first().then(el => {
                    el.find('.gear_menu').click()
                    cy.get('.ist_menu:visible').find('.sel_delete_task').click()
                    cy.get('footer.reactist_modal_box__actions > button[type=submit]').click()

                    cy.contains(el.text()).should('not.exist')

                    cy.get(app.selectors.todos).should('have.length', length - 1)
                })
            })
        })

        after(() => {
            app.deleteInboxTodos()
            cy.clearCookies()
        })
    })
})