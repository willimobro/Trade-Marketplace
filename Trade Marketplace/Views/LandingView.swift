//
//  LandingView.swift
//  Trade Marketplace
//
//  Created by William larsen on 14/09/22.
//

import SwiftUI

struct LandingView: View {
    @Binding var selectedbutton : Views
        var body: some View {
            ZStack{
                BackgroundLogo_Main()
                ContentLanding(selectedbutton: $selectedbutton)
                VStack{
                    Image("greenvan")
                        .resizable()
                        .frame(width: 390, height: 273, alignment: .top)
                        .padding(.top, 105)
                    Spacer()
                }
            }
            }
        }
        



