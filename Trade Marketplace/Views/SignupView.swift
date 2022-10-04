//
//  SignupView.swift
//  Trade Marketplace
//
//  Created by William larsen on 16/09/22.
//

import SwiftUI

struct SignupView: View {
    @Binding var selectedbutton : Views
    var body: some View {
                    ZStack{
                        BackgroundLogo_Secoundary()
                        ContentSignup(selectedbutton: $selectedbutton)
                        VStack{
                            Image("createaccountpc")
                                .resizable()
                                .frame(width: 224  , height: 213)
                                .padding( .top, 50)
                                .shadow(color: .secondary, radius: 4, x: 0, y: 0)
                            Spacer()
                        }.frame(minWidth: 224, idealWidth: 224, maxWidth: .infinity, minHeight: 213, idealHeight: 213, maxHeight: .infinity, alignment: .trailing)
                            .padding(.trailing, 20)
                    }
    }
}

