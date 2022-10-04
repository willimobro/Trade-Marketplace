//
//  CreateQuoteView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct QuoteAJobView: View {
@State var Price = String()
@State var Currency = String()
@State var acceptbutton = false
    var body: some View {
        VStack{
            HStack(spacing: 30){
                Image(systemName: "xmark")
                    .resizable()
                    .scaledToFit()
                Text("Review Quote")
                    .font(.custom("Poppins-SemiBold", size: 28))
            }.frame(width: 321, height: 24, alignment: .leading)
            
            Divider()
                .background(.black)
                .shadow(color: .black, radius: 4, x: 0, y: 0)
                .opacity(0.5)
            
            ScrollView(.vertical){
            VStack(alignment: .leading, spacing: 10){
            Text("Title")
                .font(.custom("Poppins-SemiBold", size: 28))
            
            ProfileSub()
                
            Text("$\(Price) \(Currency)")
                    .font(.custom("Poppins-SemiBold", size: 28))
                    .underline()
                
            Text("Details")
                .font(.custom("Poppins-SemiBold", size: 28))
            
            
            Text("Hows it going john here from ajs electrical, worked on many mitubishi vehicles and i know for sure how to fix yoor problem, read the quote below for info, Cheers john.")
                .font(.custom("Poppins-SemiBold", size: 14))
                .foregroundColor(.secondary)
            list()
            
            }.padding()
            RoundedRectangle(cornerRadius: 11)
                    .frame(width: .infinity, height: 180)
                    .foregroundColor(.gray.opacity(0.10))
                    .overlay(VStack{
                        HStack (spacing: 10) {
                            Button(action:{
                                acceptbutton.toggle()
                            }){
                                Image(systemName: acceptbutton ? "checkmark.square.fill" : "checkmark.square")
                                .resizable()
                                .frame(width: 36, height: 36)
                                .foregroundColor(.green)
                            }
                            Text("Im happy with the quote and accept any terms or conditions")
                                .font(.custom("Poppins-SemiBold", size: 18))
                        }
                        AcceptQuoteButton()
                    }
                        .frame(width: 371, alignment: .center))
            
            }.ignoresSafeArea()
        }
    }
}

struct QuoteAJobView_Previews: PreviewProvider {
    static var previews: some View {
        QuoteAJobView(Price: "230.73", Currency: "NZD")
    }
}

struct ListCost: View {
    @State var purchase = String()
    @State var cost = String()
    var body: some View {
        HStack{
            Text("\(purchase)")
                .font(.custom("Poppins-SemiBold", size: 20))
                .foregroundColor(.primary)
            Spacer()
            Text("$\(cost)")
                .font(.custom("Poppins-SemiBold", size: 20))
                .foregroundColor(.primary)
        }
    }
}

struct list: View {
    var body: some View{
        Text("Time")
            .font(.custom("Poppins-SemiBold", size: 28))
        ListCost(purchase: "2hr, 30min", cost: "100")
        
        Text("Material Costs")
            .font(.custom("Poppins-SemiBold", size: 28))
        ListCost(purchase: "Speedometer", cost: "48.93")
        ListCost(purchase: "Wiring Equipment", cost: "25.00")
            
        Text("Fuel Costs")
            .font(.custom("Poppins-SemiBold", size: 28))
        ListCost(purchase: "168Km", cost: "56.86")
        Text("calculated via TM Fuelcalc.")
            .font(.custom("Poppins-SemiBold", size: 14))
            .foregroundColor(.gray)
        
        Text("Other")
            .font(.custom("Poppins-SemiBold", size: 28))
        ListCost(purchase: "N/A", cost: "N/A")
        
    }
}
