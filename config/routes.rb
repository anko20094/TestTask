Rails.application.routes.draw do
  root 'links#index'
  resources :links, only: %i[index create]
end
