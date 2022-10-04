//
//  ContentWhite.swift
//  Trade Marketplace
//
//  Created by William larsen on 14/09/22.
//

import SwiftUI

struct ContentLanding: View {
    @Binding var selectedbutton : Views
    var body: some View {
        ZStack{
            Rectangle()
                .foregroundColor(.white)
                .ignoresSafeArea()
            Spacer()
            VStack(spacing: 40) {
                    Text("Save Money, \nMake Money.")
                            .font(.largeTitle)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                            .frame(width: 321, height: 100, alignment: .bottomLeading)
                            
                    Text("Trade Marketplace")
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                            .frame(width: 321, alignment: .leading)
                    Button("Log In"){
                        selectedbutton = .login
                        
                    }
                                .frame(width: 321, height: 55, alignment: .center)
                                .background(Color("ButtonColorSL"))
                                .cornerRadius(15)
                                .foregroundColor(.white)
                    Button("Sign Up") {
                        selectedbutton = .signup
                        
                    }
                            .padding()
                            .frame(width: 321, height: 55, alignment: .center)
                            .background(Color("ButtonColorSL"))
                            .cornerRadius(15)
                            .foregroundColor(.white)
            }
    }.frame(width: .infinity, height: .infinity)
    .padding(.top, 300)
    }
}

