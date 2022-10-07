//
//  MainObject.swift
//  Trade Marketplace
//
//  Created by William larsen on 17/09/22.
//

//
//  Categorys.swift
//  Trade Marketplace
//
//  Created by William larsen on 16/09/22.
//

import SwiftUI

struct MainObject: View {
    var body: some View {
        NavigationLink(destination: ItemView())  {
                Image("money")
                    .resizable()
                    .cornerRadius(11)
                    .frame(width: 159, height: 162)
                    .foregroundColor(.white)
                    .shadow(color:Color("dropshadow25"), radius: 8, x: 0, y: 6)
                    .overlay(RoundedRectangle(cornerRadius: 11)
                        .fill(LinearGradient(gradient: Gradient(colors: [Color.clear, Color.black]),
                            startPoint: .top,
                                             endPoint: .bottom)).opacity(0.5))
                    .overlay(
                        VStack{
                            Text("Electrical")
                                .font(.title3)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .padding(15)
                        }.frame(width: 159, height: 162, alignment: .bottomLeading))
                    
                    
        }
    }
}

struct MainObject_Previews: PreviewProvider {
    static var previews: some View {
        MainObject()
    }
}
